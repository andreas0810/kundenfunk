<?php
/**
 * Plugin Name: Kundenfunk
 * Plugin URI: https://kundenfunk.pages.dev/wordpress/
 * Author: Kundenfunk
 * Author URI: https://kundenfunk.pages.dev/
 * Text Domain: kundenfunk
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Description: WhatsApp-Kanalnachrichten als Homepage-Addon mit Themes, Geräte-Skins und Aktualisierungsplan.
 * Version: 0.4.1
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; }
define( 'KF_VERSION', '0.4.1' );

function kf_defaults() {
	return array(
		'source'          => 'account',
		'theme'           => 'classic',
		'skin'            => 'none',
		'layout'          => 'list',
		'limit'           => 12,
		'refresh_minutes' => 15,
		'schedule_mode'   => 'interval',
		'interval'        => 15,
		'times'           => '08:00, 12:00, 18:00',
	); }
function kf_choices() {
	return array(
		'theme'  => array(
			'classic'   => 'WhatsApp',
			'light'     => 'Hell',
			'dark'      => 'Dunkel',
			'editorial' => 'Magazin',
		),
		'skin'   => array(
			'none'    => 'Ohne Rahmen',
			'iphone'  => 'Smartphone · Schwarz',
			'android' => 'Smartphone · Silber',
			'ipad'    => 'Tablet · iPad',
		),
		'layout' => array(
			'list'    => 'Nachrichten',
			'cards'   => 'Karten',
			'compact' => 'Kompakt',
		),
	); }
function kf_presentation( $input ) {
	$input = is_array( $input ) ? $input : array();
	$out   = array();
	foreach ( kf_choices() as $key => $choices ) {
		$value       = $input[ $key ] ?? '';
		$out[ $key ] = is_string( $value ) && isset( $choices[ $value ] ) ? $value : kf_defaults()[ $key ]; }
	$limit                  = (int) ( $input['limit'] ?? 12 );
	$out['limit']           = $limit >= 1 && $limit <= 12 ? $limit : 12;
	$refresh                = (int) ( $input['refresh_minutes'] ?? 15 );
	$out['refresh_minutes'] = in_array( $refresh, array( 15, 30, 60, 180 ), true ) ? $refresh : 15;
	return $out;
}
function kf_settings() {
	return array_merge( kf_defaults(), get_option( 'kf_settings', array() ) ); }
function kf_times( $text ) {
	if ( ! is_string( $text ) ) {
		return false;
	} $times = array_map( 'trim', explode( ',', $text ) );
	if ( ! $times || count( $times ) > 6 ) {
		return false; }
	foreach ( $times as $time ) {
		if ( ! preg_match( '/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/', $time ) ) {
			return false; }
	}
	$times = array_values( array_unique( $times ) );
	sort( $times );
	return $times;
}
function kf_next_fixed_time( $times, $now = null, $zone = null ) {
	$zone  = $zone ?: wp_timezone();
	$now   = $now === null ? time() : (int) $now;
	$today = ( new DateTimeImmutable( '@' . $now ) )->setTimezone( $zone )->setTime( 0, 0 );
	for ( $day = 0;$day < 3;$day++ ) {
		$candidates = array();
		foreach ( $times as $time ) {
			list($hour, $minute) = array_map( 'intval', explode( ':', $time ) );
			$candidate           = $today->modify( '+' . $day . ' days' )->setTime( $hour, $minute )->getTimestamp();
			if ( $candidate > $now ) {
				$candidates[] = $candidate; }
		}
		if ( $candidates ) {
			return min( $candidates ); }
	}
	return $now + DAY_IN_SECONDS;
}
add_filter(
	'cron_schedules',
	function ( $s ) {
		foreach ( array( 15, 30, 60, 180 ) as $minutes ) {
			$s[ 'kf_' . $minutes . 'min' ] = array(
				'interval' => $minutes * 60,
				'display'  => 'Kundenfunk: alle ' . $minutes . ' Minuten',
			);
		} return $s;
	}
);
function kf_schedule( $reset = false ) {
	if ( $reset ) {
		wp_clear_scheduled_hook( 'kf_sync_event' ); }
	$connection = get_option( 'kf_connection', array() );
	if ( empty( $connection['token'] ) || empty( $connection['api'] ) ) {
		wp_clear_scheduled_hook( 'kf_sync_event' );
		return; }
	if ( wp_next_scheduled( 'kf_sync_event' ) ) {
		return; }
	$settings = kf_settings();
	if ( $settings['schedule_mode'] === 'fixed' ) {
		wp_schedule_single_event( kf_next_fixed_time( kf_times( $settings['times'] ) ?: array( '08:00' ) ), 'kf_sync_event' ); } else {
		wp_schedule_event( time() + (int) $settings['interval'] * 60, 'kf_' . (int) $settings['interval'] . 'min', 'kf_sync_event' ); }
}
add_action( 'init', 'kf_schedule' );
register_activation_hook(
	__FILE__,
	function () {
		kf_schedule( true );
	}
);
register_deactivation_hook(
	__FILE__,
	function () {
		wp_clear_scheduled_hook( 'kf_sync_event' );
	}
);
add_action(
	'kf_sync_event',
	function () {
		try {
			kf_sync();
		} finally {
			kf_schedule();
		}}
);

function kf_api( $base, $route, $token = '', $body = null ) {
	$parts = wp_parse_url( $base );
	if ( ! $parts || ( $parts['scheme'] ?? '' ) !== 'https' || empty( $parts['host'] ) || isset( $parts['user'] ) || isset( $parts['pass'] ) || isset( $parts['query'] ) || isset( $parts['fragment'] ) || ! empty( $parts['path'] ) ) {
		return new WP_Error( 'kf_url', 'Eine HTTPS-Serveradresse ohne Pfad eingeben.' ); }
	$args = array(
		'timeout'             => 15,
		'redirection'         => 0,
		'limit_response_size' => 1048576,
		'headers'             => array( 'Accept' => 'application/json' ),
	);
	if ( $token !== '' ) {
		$args['headers']['Authorization'] = 'Bearer ' . $token; }
	if ( $body !== null ) {
		$args['body']                    = wp_json_encode( $body );
		$args['headers']['Content-Type'] = 'application/json'; }
	$response = $body === null ? wp_safe_remote_get( $base . $route, $args ) : wp_safe_remote_post( $base . $route, $args );
	if ( is_wp_error( $response ) ) {
		return $response; }
	$code = wp_remote_retrieve_response_code( $response );
	$data = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( $code < 200 || $code >= 300 ) {
		return new WP_Error( 'kf_http', 'Kundenfunk ist vorübergehend nicht verfügbar (Status ' . $code . ').', array( 'status' => $code ) ); }
	return is_array( $data ) ? $data : new WP_Error( 'kf_data', 'Ungültige Antwort des Kundenfunk-Dienstes.' );
}
function kf_connect() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Keine Berechtigung.' );
	} check_admin_referer( 'kf_connect' );
	$base   = untrailingslashit( esc_url_raw( wp_unslash( $_POST['api'] ?? '' ) ) );
	$token  = sanitize_text_field( wp_unslash( $_POST['connection'] ?? '' ) );
	$parts  = wp_parse_url( home_url() );
	$origin = $parts['scheme'] . '://' . $parts['host'] . ( isset( $parts['port'] ) ? ':' . $parts['port'] : '' );
	$data   = preg_match( '/^[a-f0-9]{64}$/', $token ) ? kf_api( $base, '/v1/license', $token ) : new WP_Error( 'kf_token', 'Den API-Schlüssel aus deiner aktivierten Kundenansicht eingeben.' );
	if ( is_wp_error( $data ) ) {
		update_option( 'kf_status', $data->get_error_message(), false ); } elseif ( empty( $data['valid'] ) || ( $data['site_origin'] ?? '' ) !== $origin ) {
		update_option( 'kf_status', 'Dieser API-Schlüssel gehört nicht zu dieser Website. Die freigeschaltete Websiteadresse prüfen.', false ); } else {
			update_option(
				'kf_connection',
				array(
					'api'   => $base,
					'token' => $token,
				),
				false
			);
			delete_option( 'kf_feed' );
			delete_option( 'kf_checked' );
			kf_sync();
			kf_schedule( true ); }
		wp_safe_redirect( admin_url( 'options-general.php?page=kundenfunk' ) );
		exit;
}
function kf_save_settings() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Keine Berechtigung.' );
	} check_admin_referer( 'kf_settings' );
	$raw                       = isset( $_POST['kf'] ) && is_array( $_POST['kf'] ) ? array_map( 'sanitize_text_field', wp_unslash( $_POST['kf'] ) ) : array();
	$settings                  = array_merge( kf_defaults(), kf_presentation( $raw ) );
	$settings['source']        = ( $raw['source'] ?? '' ) === 'plugin' ? 'plugin' : 'account';
	$settings['schedule_mode'] = ( $raw['schedule_mode'] ?? '' ) === 'fixed' ? 'fixed' : 'interval';
	$settings['interval']      = in_array( (int) ( $raw['interval'] ?? 15 ), array( 15, 30, 60, 180 ), true ) ? (int) $raw['interval'] : 15;
	$times                     = kf_times( $raw['times'] ?? kf_defaults()['times'] );
	if ( ! $times ) {
		wp_die( 'Bitte bis zu sechs Uhrzeiten als HH:MM mit Komma getrennt eingeben.' ); }
	$settings['times'] = implode( ', ', $times );
	update_option( 'kf_settings', $settings, false );
	kf_schedule( true );
	do_action( 'kundenfunk_feed_updated' );
	wp_safe_redirect( admin_url( 'options-general.php?page=kundenfunk&saved=1' ) );
	exit;
}
add_action( 'admin_post_kf_connect', 'kf_connect' );
add_action( 'admin_post_kf_settings', 'kf_save_settings' );
add_action(
	'admin_post_kf_sync',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Keine Berechtigung.' );
		}check_admin_referer( 'kf_sync' );
		kf_sync();
		wp_safe_redirect( admin_url( 'options-general.php?page=kundenfunk' ) );
		exit;
	}
);
function kf_sync() {
	$connection = get_option( 'kf_connection', array() );
	if ( empty( $connection['api'] ) || empty( $connection['token'] ) ) {
		return; }
	$lock = (int) get_option( '_kf_sync_lock', 0 );
	if ( $lock && $lock > time() - 60 ) {
		return; }
	if ( $lock ) {
		delete_option( '_kf_sync_lock' );
	} if ( ! add_option( '_kf_sync_lock', time(), '', false ) ) {
		return; }
	try {
		update_option( 'kf_attempted', time(), false );
		$feed = kf_api( $connection['api'], '/v1/feed', $connection['token'] );
		if ( $connection !== get_option( 'kf_connection', array() ) ) {
			return; }
		if ( is_wp_error( $feed ) ) {
			$detail = $feed->get_error_data();
			if ( is_array( $detail ) && in_array( $detail['status'] ?? 0, array( 401, 403, 404 ), true ) ) {
				delete_option( 'kf_feed' );
				delete_option( 'kf_checked' ); }
			update_option( 'kf_status', $feed->get_error_message(), false );
			do_action( 'kundenfunk_feed_updated' );
			return;
		}
		if ( ! isset( $feed['posts'] ) || ! is_array( $feed['posts'] ) || ! isset( $feed['channel']['name'] ) ) {
			update_option( 'kf_status', 'Unvollständiger Feed; letzter gültiger Stand bleibt erhalten.', false );
			return; }
		$posts = array();
		foreach ( array_slice( $feed['posts'], 0, 50 ) as $post ) {
			if ( ! is_array( $post ) ) {
				continue;
			} $posts[] = array(
				'text'      => sanitize_textarea_field( $post['text'] ?? '' ),
				'timestamp' => sanitize_text_field( $post['timestamp'] ?? '' ),
				'media'     => array_slice( is_array( $post['media'] ?? null ) ? $post['media'] : array(), 0, 4 ),
			); }
		$channel = isset( $feed['channel']['url'] ) && preg_match( '~^https://(?:www\.)?whatsapp\.com/channel/[a-zA-Z0-9]+/?$~', $feed['channel']['url'] ) ? $feed['channel']['url'] : '';
		update_option(
			'kf_feed',
			array(
				'name'        => sanitize_text_field( $feed['channel']['name'] ),
				'channel_url' => $channel,
				'posts'       => $posts,
				'widget'      => kf_presentation( $feed['widget'] ?? array() ),
			),
			false
		);
		update_option( 'kf_checked', time(), false );
		update_option( 'kf_status', count( $posts ) . ' Nachrichten erfolgreich abgerufen.', false );
		do_action( 'kundenfunk_feed_updated' );
	} finally {
		delete_option( '_kf_sync_lock' ); }
}
function kf_effective_presentation( $feed, $attributes = array() ) {
	$settings = kf_settings();
	$base     = $settings['source'] === 'account' ? ( $feed['widget'] ?? array() ) : $settings;
	return kf_presentation( array_merge( kf_presentation( $base ), array_intersect_key( $attributes, array_flip( array( 'theme', 'skin', 'layout', 'limit' ) ) ) ) );
}
function kf_render_feed( $feed, $settings, $demo = false ) {
	$classes = 'kf-embed kf-theme-' . $settings['theme'] . ' kf-skin-' . $settings['skin'] . ' kf-layout-' . $settings['layout'];
	$html    = '<div class="' . esc_attr( $classes ) . '"><section class="kf-device"><div class="kf-display"><header class="kf-header"><span class="kf-avatar" aria-hidden="true">◌</span><div><h2>' . esc_html( $feed['name'] ) . '</h2><small>Öffentlicher WhatsApp-Kanal</small></div></header><div class="kf-posts">';
	if ( $demo ) {
		$html .= '<p class="kf-demo-label">Vorschau mit Beispieldaten</p>'; }
	if ( empty( $feed['posts'] ) ) {
		$html .= '<div class="kf-empty"><h2>Noch keine Beiträge</h2><p>Neue Kanalbeiträge erscheinen nach dem nächsten erfolgreichen Abruf.</p></div>'; }
	$connection = get_option( 'kf_connection', array() );
	foreach ( array_slice( $feed['posts'], 0, $settings['limit'] ) as $post ) {
		$html .= '<article><time>' . esc_html( substr( $post['timestamp'], 0, 10 ) ) . '</time>';
		foreach ( $post['media'] ?? array() as $media ) {
			if ( ( $media['type'] ?? '' ) === 'image' && ! empty( $connection['api'] ) && strpos( $media['url'] ?? '', $connection['api'] . '/v1/embed/' ) === 0 ) {
				$html .= '<img loading="lazy" src="' . esc_url( $media['url'] ) . '" alt="">'; }
		}
		$html .= '<p>' . nl2br( esc_html( $post['text'] ) ) . '</p></article>';
	}
	$html .= '</div>';
	if ( ! empty( $feed['channel_url'] ) ) {
		$html .= '<footer class="kf-footer"><a class="kf-follow" href="' . esc_url( $feed['channel_url'] ) . '" target="_blank" rel="noopener noreferrer">Auf WhatsApp folgen ↗</a></footer>'; }
	return $html . '</div></section></div>';
}
function kf_shortcode( $attributes = array() ) {
	$feed    = get_option( 'kf_feed' );
	$checked = (int) get_option( 'kf_checked', 0 );
	if ( ! $feed || ! $checked || time() - $checked > DAY_IN_SECONDS ) {
		return '<p class="kundenfunk-status">Neuigkeiten sind vorübergehend nicht verfügbar.</p>'; }
	wp_enqueue_style( 'kundenfunk-feed', plugins_url( 'assets/feed.css', __FILE__ ), array(), KF_VERSION );
	return kf_render_feed( $feed, kf_effective_presentation( $feed, is_array( $attributes ) ? $attributes : array() ) );
}
add_shortcode( 'kundenfunk', 'kf_shortcode' );
function kf_demo_feed() {
	return array(
		'name'  => 'Dein WhatsApp-Kanal',
		'posts' => array(
			array(
				'text'      => 'Hier erscheinen deine Neuigkeiten – automatisch aus deinem öffentlichen WhatsApp-Kanal.',
				'timestamp' => '2026-10-22',
				'media'     => array(),
			),
			array(
				'text'      => 'Wähle ein Theme und einen Geräte-Skin passend zu deiner Homepage.',
				'timestamp' => '2026-10-21',
				'media'     => array(),
			),
		),
	);}
add_action(
	'admin_menu',
	function () {
		add_options_page( 'Kundenfunk', 'Kundenfunk', 'manage_options', 'kundenfunk', 'kf_page' );
	}
);
add_action(
	'admin_enqueue_scripts',
	function ( $hook ) {
		if ( $hook !== 'settings_page_kundenfunk' ) {
			return;
		}wp_enqueue_style( 'kundenfunk-feed', plugins_url( 'assets/feed.css', __FILE__ ), array(), KF_VERSION );
		wp_enqueue_style( 'kundenfunk-admin', plugins_url( 'assets/admin.css', __FILE__ ), array(), KF_VERSION );
		wp_enqueue_script( 'kundenfunk-admin', plugins_url( 'assets/admin.js', __FILE__ ), array(), KF_VERSION, true );
	}
);
function kf_select( $key, $label, $values, $selected ) {
	echo '<label>' . esc_html( $label ) . '<select name="kf[' . esc_attr( $key ) . ']" data-kf-option="' . esc_attr( $key ) . '">';
	foreach ( $values as $value => $name ) {
		echo '<option value="' . esc_attr( $value ) . '"' . selected( (string) $selected, (string) $value, false ) . '>' . esc_html( $name ) . '</option>';}
	echo '</select></label>';
}
function kf_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	} $connection = get_option( 'kf_connection', array() );
	$settings     = kf_settings();
	$feed         = get_option( 'kf_feed' );
	$checked      = (int) get_option( 'kf_checked', 0 );
	$next         = wp_next_scheduled( 'kf_sync_event' );
	?>
	<div class="wrap kf-admin"><h1>Kundenfunk <small>Das WhatsApp-Addon für deine Homepage</small></h1>
	<p>Einmal im WhatsApp-Kanal veröffentlichen. Hier als Nachrichtenfeed auf deiner Website anzeigen.</p>
	<div class="kf-status"><strong><?php echo esc_html( get_option( 'kf_status', 'Noch nicht verbunden.' ) ); ?></strong><span>Letzter erfolgreicher Abruf: <?php echo $checked ? esc_html( wp_date( 'd.m.Y. H:i', $checked ) ) : '–'; ?></span><span>Nächster geplanter Abruf: <?php echo $next ? esc_html( wp_date( 'd.m.Y. H:i', $next ) ) : 'Noch nicht eingeplant'; ?></span></div>
	<details class="kf-connection" <?php echo empty( $connection['token'] ) ? 'open' : ''; ?>><summary>1. Kundenfunk-Verbindung</summary><p>Aktiviere deine Lizenz im Kundenkonto. Trage dann Serveradresse und API-Schlüssel hier ein. Deine Lizenz wird im Plugin kein zweites Mal aktiviert. Mit „Website verbinden“ erlaubst du die Anfrage an den angegebenen Kundenfunk-Dienst mit deinem API-Schlüssel und die anschließenden geplanten Feed-Abrufe.</p><form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><input type="hidden" name="action" value="kf_connect"><?php wp_nonce_field( 'kf_connect' ); ?><label>Kundenfunk-Serveradresse<input type="url" name="api" required value="<?php echo esc_attr( $connection['api'] ?? 'https://kundenfunk.pages.dev' ); ?>"></label><label>Privater API-Schlüssel<input type="password" name="connection" required autocomplete="off"></label><p>Nur in den Plugin-Einstellungen hinterlegen. Der Schlüssel wird nicht im Einbettungscode oder Seiteninhalt ausgegeben.</p><?php submit_button( 'Website verbinden' ); ?></form></details>
	<p><a href="https://kundenfunk.pages.dev/entwickler/">Einbauhilfe</a> · <a href="https://kundenfunk.pages.dev/kompatibilitaet/">Kompatibilität</a> · <a href="https://kundenfunk.pages.dev/wordpress/#datenaustausch">Datenübertragung und Dienst</a></p>
	<div class="kf-admin-layout"><form class="kf-panel" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><input type="hidden" name="action" value="kf_settings"><?php wp_nonce_field( 'kf_settings' ); ?><h2>2. Darstellung</h2>
	<?php
	kf_select(
		'source',
		'Design-Einstellungen',
		array(
			'account' => 'Aus meinem Kundenkonto übernehmen',
			'plugin'  => 'Für diese WordPress-Website anpassen',
		),
		$settings['source']
	);
	foreach ( kf_choices() as $key => $choices ) {
		kf_select(
			$key,
			array(
				'theme'  => 'Feed-Theme',
				'skin'   => 'Geräte-Skin',
				'layout' => 'Layout',
			)[ $key ],
			$choices,
			$settings[ $key ]
		);
	} kf_select(
		'limit',
		'Anzahl Beiträge',
		array(
			3  => '3 Beiträge',
			6  => '6 Beiträge',
			12 => '12 Beiträge',
		),
		$settings['limit']
	);
	?>
	<p>Die lokale Design-Auswahl gilt nach dem Speichern mit „Für diese WordPress-Website anpassen“. Im Kontomodus bleibt das zentrale Design maßgeblich.</p><h2>3. Aktualisierungsplan</h2>
	<?php
	kf_select(
		'schedule_mode',
		'Nachrichten abrufen',
		array(
			'interval' => 'In regelmäßigen Abständen',
			'fixed'    => 'Zu festen täglichen Uhrzeiten',
		),
		$settings['schedule_mode']
	);
	kf_select(
		'interval',
		'Intervall',
		array(
			15  => 'Alle 15 Minuten',
			30  => 'Alle 30 Minuten',
			60  => 'Stündlich',
			180 => 'Alle 3 Stunden',
		),
		$settings['interval']
	);
	?>
	<label>Feste Uhrzeiten<input name="kf[times]" value="<?php echo esc_attr( $settings['times'] ); ?>" placeholder="08:00, 12:00, 18:00"><small>Bis zu sechs Uhrzeiten. Website-Zeitzone: <?php echo esc_html( wp_timezone()->getName() ); ?>.</small></label><p>Für pünktliche feste Uhrzeiten einen Server-Cron einrichten. Normales WP-Cron wird erst durch Websitebesuche ausgelöst. Seitencaches müssen Aktualisierungen ebenfalls übernehmen.</p><?php submit_button( 'Design und Zeitplan speichern' ); ?></form>
	<section class="kf-preview-panel"><h2>Deine Vorschau</h2><p>Änderungen erst speichern, damit sie auf deiner Website gelten.</p><div id="kf-preview" data-account="<?php echo esc_attr( wp_json_encode( kf_presentation( $feed['widget'] ?? array() ) ) ); ?>">
	<?php
    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- kf_render_feed escapes text, attributes and URLs at their output context.
	echo kf_render_feed( $feed ?: kf_demo_feed(), kf_effective_presentation( $feed ?: array() ), ! $feed );
	?>
	</div></section></div>
	<section class="kf-panel"><h2>4. Auf deiner Website anzeigen</h2><p>Den Shortcode <code>[kundenfunk]</code> in eine Seite oder einen Shortcode-Block einsetzen.</p><p>Optional pro Einbindung: <code>[kundenfunk theme="dark" skin="iphone" layout="list" limit="6"]</code></p><form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><input type="hidden" name="action" value="kf_sync">
	<?php
	wp_nonce_field( 'kf_sync' );
	submit_button( 'Jetzt synchronisieren', 'secondary' );
	?>
	</form><p>Manuelles Synchronisieren ruft sofort ab. Der Zeitplan bleibt bestehen. Der aktuelle Dienst übernimmt Texte und Bildunterschriften; Medienanhänge bleiben im WhatsApp-Kanal.</p><p>Bei bestätigter Zugangssperre wird der lokale Feed gelöscht; bei einem Netzfehler höchstens 24 Stunden Fallback. Cacheplugins können <code>kundenfunk_feed_updated</code> zur Invalidierung verwenden.</p></section></div>
	<?php
}
