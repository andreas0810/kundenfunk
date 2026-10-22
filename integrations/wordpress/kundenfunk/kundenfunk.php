<?php
/**
 * Plugin Name: Kundenfunk
 * Description: Lizenzierte Kundenfunk-Einbindung mit serverseitiger Aktivierung und Feed-Synchronisation.
 * Version: 0.2.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }

add_action('admin_menu', function () { add_options_page('Kundenfunk', 'Kundenfunk', 'manage_options', 'kundenfunk', 'kf_page'); });
add_action('admin_post_kf_connect', 'kf_connect');
add_action('admin_post_kf_sync', function () {
    if (!current_user_can('manage_options')) { wp_die('Keine Berechtigung.'); }
    check_admin_referer('kf_sync'); kf_sync(); wp_safe_redirect(admin_url('options-general.php?page=kundenfunk')); exit;
});
add_filter('cron_schedules', function ($s) { $s['kf_15min'] = array('interval' => 900, 'display' => 'Kundenfunk: alle 15 Minuten'); return $s; });
add_action('kf_sync_event', 'kf_sync');
register_activation_hook(__FILE__, function () { if (!wp_next_scheduled('kf_sync_event')) { wp_schedule_event(time() + 60, 'kf_15min', 'kf_sync_event'); } });
register_deactivation_hook(__FILE__, function () { wp_clear_scheduled_hook('kf_sync_event'); });

function kf_api($base, $route, $token = '', $body = null) {
    $parts = wp_parse_url($base);
    if (!$parts || ($parts['scheme'] ?? '') !== 'https' || empty($parts['host']) || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment']) || !empty($parts['path'])) {
        return new WP_Error('kf_url', 'Eine HTTPS-API-Adresse ohne Pfad eingeben.');
    }
    $args = array('timeout' => 15, 'redirection' => 0, 'limit_response_size' => 1048576, 'headers' => array('Accept' => 'application/json'));
    if ($token !== '') { $args['headers']['Authorization'] = 'Bearer ' . $token; }
    if ($body !== null) { $args['body'] = wp_json_encode($body); $args['headers']['Content-Type'] = 'application/json'; }
    $r = $body === null ? wp_safe_remote_get($base . $route, $args) : wp_safe_remote_post($base . $route, $args);
    if (is_wp_error($r)) { return $r; }
    $code = wp_remote_retrieve_response_code($r); $data = json_decode(wp_remote_retrieve_body($r), true);
    if ($code < 200 || $code >= 300) { return new WP_Error('kf_http', 'API-Status ' . $code . ': ' . sanitize_text_field($data['error'] ?? 'Anfrage fehlgeschlagen'), array('status' => $code)); }
    return is_array($data) ? $data : new WP_Error('kf_data', 'Ungültige API-Antwort.');
}
function kf_connect() {
    if (!current_user_can('manage_options')) { wp_die('Keine Berechtigung.'); }
    check_admin_referer('kf_connect');
    $base = untrailingslashit(esc_url_raw(wp_unslash($_POST['api'] ?? '')));
    $token = sanitize_text_field(wp_unslash($_POST['connection'] ?? ''));
    $parts = wp_parse_url(home_url());
    $origin = $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
    $data = preg_match('/^[a-f0-9]{64}$/', $token) ? kf_api($base, '/v1/license', $token) : new WP_Error('kf_token', 'Den privaten Verbindungscode aus deiner aktivierten Kundenansicht eingeben.');
    if (is_wp_error($data)) { update_option('kf_status', $data->get_error_message(), false); }
    elseif (empty($data['valid']) || ($data['site_origin'] ?? '') !== $origin) { update_option('kf_status', 'Dieser Verbindungscode gehört nicht zu dieser Website. Die freigeschaltete Websiteadresse im Kundenbereich prüfen.', false); }
    else {
        update_option('kf_connection', array('api' => $base, 'token' => $token), false);
        delete_option('kf_feed'); delete_option('kf_checked'); kf_sync();
    }
    wp_safe_redirect(admin_url('options-general.php?page=kundenfunk')); exit;
}
function kf_sync() {
    $c = get_option('kf_connection', array()); if (empty($c['api']) || empty($c['token'])) { return; }
    $feed = kf_api($c['api'], '/v1/feed', $c['token']);
    if (is_wp_error($feed)) {
        $detail = $feed->get_error_data();
        if (is_array($detail) && in_array($detail['status'] ?? 0, array(401,403,404), true)) { delete_option('kf_feed'); delete_option('kf_checked'); }
        update_option('kf_status', $feed->get_error_message(), false); do_action('kundenfunk_feed_updated'); return;
    }
    if (!isset($feed['posts']) || !is_array($feed['posts']) || !isset($feed['channel']['name'])) { update_option('kf_status', 'Unvollständiger Feed; letzter gültiger Stand bleibt erhalten.', false); return; }
    $posts = array();
    foreach (array_slice($feed['posts'], 0, 50) as $post) {
        if (!is_array($post)) { continue; }
        $posts[] = array('text' => sanitize_textarea_field($post['text'] ?? ''), 'timestamp' => sanitize_text_field($post['timestamp'] ?? ''), 'media' => array_slice(is_array($post['media'] ?? null) ? $post['media'] : array(), 0, 4));
    }
    update_option('kf_feed', array('name' => sanitize_text_field($feed['channel']['name']), 'posts' => $posts), false);
    update_option('kf_checked', time(), false); update_option('kf_status', 'Feed erfolgreich synchronisiert.', false);
    // Cache plugins can subscribe; generic full-page cache invalidation is not portable.
    do_action('kundenfunk_feed_updated');
}
add_shortcode('kundenfunk', function () {
    $feed = get_option('kf_feed'); $checked = (int) get_option('kf_checked', 0);
    if (!$feed || time() - $checked > DAY_IN_SECONDS) { return '<p class="kundenfunk-status">Neuigkeiten sind vorübergehend nicht verfügbar.</p>'; }
    $connection = get_option('kf_connection', array());
    $html = '<section class="kundenfunk-feed" aria-label="Neuigkeiten"><h2>' . esc_html($feed['name']) . '</h2>';
    if (empty($feed['posts'])) { $html .= '<p>Noch keine Beiträge.</p>'; }
    foreach (array_slice($feed['posts'], 0, 12) as $post) {
        $html .= '<article><time>' . esc_html(substr($post['timestamp'], 0, 10)) . '</time><p>' . nl2br(esc_html($post['text'])) . '</p>';
        foreach ($post['media'] as $m) {
            if (($m['type'] ?? '') === 'image' && strpos($m['url'] ?? '', $connection['api'] . '/v1/embed/') === 0) {
                $html .= '<img loading="lazy" style="max-width:100%;height:auto" src="' . esc_url($m['url']) . '" alt="">';
            }
        }
        $html .= '</article>';
    }
    return $html . '</section>';
});
function kf_page() {
    if (!current_user_can('manage_options')) { return; }
    $c = get_option('kf_connection', array());
    ?>
    <div class="wrap"><h1>Kundenfunk</h1>
      <p>Aktiviere deine Lizenz zuerst in deiner Kundenfunk-Kundenansicht. Kopiere danach die Serveradresse und den privaten WordPress-Verbindungscode von dort hierher.</p>
      <p><strong><?php echo esc_html(get_option('kf_status', 'Noch nicht verbunden.')); ?></strong></p>
      <p>Den Verbindungscode nur hier eingeben, niemals in einen Beitrag oder Einbettungscode. Die Lizenz ist bereits aktiviert; hier wird keine zweite Installation angelegt.</p>
      <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
        <input type="hidden" name="action" value="kf_connect"><?php wp_nonce_field('kf_connect'); ?>
        <p><label>Kundenfunk-Serveradresse <input type="url" name="api" required placeholder="https://api.deine-domain.de" value="<?php echo esc_attr($c['api'] ?? ''); ?>" class="regular-text"></label></p>
        <p><label>Privater WordPress-Verbindungscode <input type="password" name="connection" required autocomplete="off" class="regular-text"></label></p>
        <?php submit_button('Website verbinden'); ?>
      </form>
      <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post"><input type="hidden" name="action" value="kf_sync"><?php wp_nonce_field('kf_sync'); submit_button('Jetzt synchronisieren', 'secondary'); ?></form>
      <h2>Auf der Website anzeigen</h2><p>Shortcode <code>[kundenfunk]</code> in eine Seite einfügen.</p>
      <p>Automatischer Abruf etwa alle 15 Minuten über WP-Cron. Für feste Zeiten einen echten Server-Cron konfigurieren. Seitencaches müssen beim Aktualisieren geleert werden; dafür steht der Hook <code>kundenfunk_feed_updated</code> bereit.</p>
      <p>Text wird lokal gespeichert, Bilder kommen vom Kundenfunk-Server. Bei bestätigter Sperre wird der lokale Feed entfernt; bei einem Verbindungsfehler bleibt er höchstens 24 Stunden sichtbar. Externe Seitencaches müssen dieselbe Grenze einhalten.</p>
    </div>
    <?php
}
