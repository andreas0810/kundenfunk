=== Kundenfunk ===
Requires at least: 6.0
Requires PHP: 7.4
Stable tag: 0.4.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Dein WhatsApp-Kanal als Homepage-Addon. Texte automatisch in WordPress anzeigen, Themes und Geräte-Skins wählen und Abrufzeiten festlegen. Ein freigeschalteter Kundenfunk-Zugang ist erforderlich.

== Installation ==
1. Persönlichen Einrichtungslink öffnen, eigenes Passwort vergeben und Lizenz im Kundenkonto aktivieren. SIM vorbereiten, WhatsApp per QR koppeln und Kanal bestätigen.
2. ZIP über Plugins > Installieren > Plugin hochladen installieren und aktivieren.
3. Im Kundenkonto einen API-Schlüssel für WordPress erstellen. Einstellungen > Kundenfunk: HTTPS-Serveradresse ohne Pfad und API-Schlüssel eintragen. Keine zweite Lizenzaktivierung nötig.
4. Design aus dem Kundenkonto übernehmen oder für diese WordPress-Website anpassen. Theme, Geräte-Skin, Layout und Beitragsanzahl wählen.
5. Aktualisierungsplan festlegen: alle 15, 30, 60 oder 180 Minuten oder bis zu sechs feste tägliche Uhrzeiten. Verwendet wird die Website-Zeitzone aus WordPress.
6. Shortcode [kundenfunk] in eine Seite oder einen Shortcode-Block einsetzen. Einen neuen Kanalbeitrag prüfen und bei Bedarf „Jetzt synchronisieren“ wählen.

== Darstellung ==
Themes: WhatsApp, Hell, Dunkel, Magazin.
Geräte-Skins: Ohne Rahmen, schwarzes Smartphone, silbernes Smartphone, iPad-Tablet.
Layouts: Nachrichten, Karten, Kompakt.
Optional pro Einbindung: [kundenfunk theme="dark" skin="iphone" layout="list" limit="6"]
Der Kontomodus übernimmt das zentrale Design beim nächsten erfolgreichen Abruf. Im Plugin-Modus gelten die lokalen Einstellungen. Shortcode-Attribute überschreiben die Darstellung nur für die jeweilige Einbindung.

== Aktualisierungsplan ==
Im Intervall-Modus wird ein wiederkehrender WP-Cron-Auftrag angelegt. Im Uhrzeiten-Modus wird jeweils der nächste einzelne Tagesauftrag in der WordPress-Zeitzone geplant; Sommerzeit wird berücksichtigt.
WP-Cron wird durch Websitebesuche ausgelöst. Für pünktliche feste Zeiten einen echten Server-Cron einrichten:
https://developer.wordpress.org/plugins/cron/hooking-wp-cron-into-the-system-task-scheduler/
Der nächste geplante Zeitpunkt und der letzte erfolgreiche Abruf erscheinen in den Plugin-Einstellungen. Manuelles Synchronisieren ruft sofort ab und ändert den gespeicherten Zeitplan nicht.
Seitencaches müssen beim Hook kundenfunk_feed_updated invalidiert werden. Ohne passende Cache-Konfiguration kann eine Seite länger einen älteren Stand zeigen.

== Externer Dienst und Daten ==
Erst nach Einrichtung verbindet sich das Plugin mit der eingegebenen Kundenfunk-API. Der private API-Schlüssel wird ausschließlich serverseitig gespeichert; er ist weder Shortcode-Attribut noch Teil der öffentlichen Ausgabe.
Der Dienst gehört zur Kundenfunk-Lizenz. Kundenfunk nutzt eine eigene SIM und gekoppelte WhatsApp-Verbindung; es ist kein offizielles Meta-API-Produkt.
Aktuell werden Texte und Bildunterschriften übernommen. Medienanhänge bleiben im WhatsApp-Kanal. Vorhandene unterstützte Bild-URLs werden nur vom Kundenfunk-Server eingebunden.
Dienstbedingungen und Datenverarbeitung erhält der Kunde vom Betreiber seiner Kundenfunk-Instanz.

== Betrieb und Grenzen ==
Noch keine Veröffentlichung auf WordPress.org und kein automatischer Plugin-Updatekanal. Updates als neues ZIP über die WordPress-Pluginverwaltung einspielen.
Bei bestätigter Zugangssperre wird der lokale Feed gelöscht; bei Netzfehlern gilt maximal 24 Stunden Fallback. Externe Seitencaches müssen dieselbe Grenze beachten.
Deaktivierung entfernt den Cronjob. Lokale Inhalte und Konfiguration bleiben für die Wiederaufnahme bestehen. Für vollständige Entfernung zusätzlich die kf_* Optionen löschen und den Websitezugang zentral sperren.

== Changelog ==
= 0.4.0 =
* Visuelle Vorschau, Themes und Geräte-Skins.
* Zentrales oder lokales Design und Shortcode-Varianten.
* Wählbare Abrufintervalle und feste tägliche Uhrzeiten mit Website-Zeitzone.
* Letzten und nächsten Abruf anzeigen; parallele Abrufe begrenzen.

== License ==
This plugin is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 2 of the License, or (at your option) any later version. It is distributed without any warranty.
See https://www.gnu.org/licenses/gpl-2.0.html for the complete license text.
