=== Kundenfunk ===
Tags: social feed, whatsapp, shortcode, news, channel
Requires at least: 6.0
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 0.4.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Display public WhatsApp channel text with themes, device frames and scheduled refreshes. Requires a paid Kundenfunk service account.

== Description ==

Kundenfunk connects your WordPress site to the Kundenfunk channel feed service.
The service operates a dedicated SIM/phone connection, receives public channel posts
and provides a website-specific feed. It is not an official Meta API product.

The connector includes four themes, three layouts, phone/tablet frames, a preview,
a [kundenfunk] shortcode and refreshes every 15, 30, 60 or 180 minutes, or at up to
six daily times in the WordPress site timezone. The settings interface is currently
in German. Channel text and captions are supported; media attachments remain in
WhatsApp. A server cron is needed for punctual scheduled refreshes.

The full connector source is included under GPLv2 or later. A paid external service
account is required. Current service pricing includes a one-time website activation
of EUR 19, separate setup and a monthly SIM/maintenance fee from EUR 12.90.
No local feature is disabled by a trial timer. See the service pricing before use:
https://kundenfunk.pages.dev/preise/

= External service and data transfer =

No service request is made merely by installing an unconfigured connector.
After an administrator supplies a server address and website API key and clicks
"Website verbinden", the connector checks /v1/license. It then requests /v1/feed
manually or according to the saved schedule. Requests send the API key in the
Authorization header. The service can observe the site's server IP and normal
HTTP request metadata. The feed contains the configured public channel name, URL,
post text, timestamps and presentation settings, and is cached in the WordPress
database. The API key is stored in a non-autoloaded WordPress option and must be
protected with the database; it is not printed in page content.

Plugin assets and previews are local. No analytics or advertising request is added
by this connector. Following a channel link opens WhatsApp. If supported images
are present in a feed, visitors may request them from the configured Kundenfunk
server; the current service does not import media attachments.

Service details and data flow: https://kundenfunk.pages.dev/wordpress/#datenaustausch
Service conditions and the applicable provider's data protection information must
be supplied with the individual service agreement before activation. The technical
data-flow page does not replace those documents.

== Installation ==

1. Arrange a Kundenfunk service account for your exact HTTPS website address.
2. Set your password using the personal invitation and activate your service license
   in the Kundenfunk customer portal. Prepare the SIM, pair WhatsApp and verify the channel.
3. Upload the plugin ZIP in Plugins > Add New > Upload Plugin and activate it.
4. Create a website API key in the Kundenfunk portal. Open Settings > Kundenfunk,
   enter the HTTPS service origin and API key, and click "Website verbinden".
5. Choose the central account design or local presentation, and save the refresh plan.
6. Place [kundenfunk] in a Shortcode block. Test a new real channel post on the published site.

== Frequently Asked Questions ==

= Is the connector listed on WordPress.org? =
Not yet. This ZIP is currently distributed from the Kundenfunk website and GitHub.
Directory acceptance and the final slug are subject to WordPress.org review.

= Where do I put the license key? =
Activate it in the Kundenfunk customer portal. The plugin uses a separate website
API key; never put a key in a shortcode, public JavaScript or Git repository.

= Can I override the design? =
Use [kundenfunk theme="dark" skin="iphone" layout="list" limit="6"].
Themes: classic, light, dark, editorial. Skins: none, iphone, android, ipad.
Layouts: list, cards, compact. Limit: 1 to 12 posts.

= What happens when access is denied or the service is unavailable? =
Confirmed HTTP 401/403/404 responses clear the local feed. Temporary failures retain
the last valid feed for at most 24 hours. External full-page caches must also be
invalidated; integrations can use the kundenfunk_feed_updated action.

= What happens when I deactivate or remove the plugin? =
Deactivation removes its cron event but preserves configuration and cached content
for reactivation. Full removal also requires deleting the kf_* options and the
_kf_sync_lock option and revoking the website key in the Kundenfunk portal.

== Changelog ==

= 0.4.1 =
* Add service, request-consent and data-flow information and links to integration help.
* Improve settings input sanitization and document safe preview output.
* Add directory-compatible English readme, tested WordPress version and GPL text.

= 0.4.0 =
* Add theme/device previews, account/local design and shortcode options.
* Add refresh intervals, daily schedules and last/next refresh status.
* Bound concurrent requests and preserve existing connection credentials.

== Upgrade Notice ==

= 0.4.1 =
Documentation and input/output review. Existing website keys and schedules remain valid.

== Development ==

Source: https://github.com/andreas0810/kundenfunk/tree/main/integrations/wordpress/kundenfunk
Integration guide: https://kundenfunk.pages.dev/entwickler/
Compatibility: https://kundenfunk.pages.dev/kompatibilitaet/
Version history and ZIP updates: https://kundenfunk.pages.dev/versionen/
There is no automatic plugin updater or WordPress.org distribution yet.
