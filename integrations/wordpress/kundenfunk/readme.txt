=== Kundenfunk ===
Requires at least: 6.0
Requires PHP: 7.4
Stable tag: 0.2.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Pilotplugin für die Kundenfunk-API. Ein eigener aktiver Kundenfunk-Zugang ist erforderlich.

== Installation ==
1. Mit dem Kundenfunk-Benutzerkonto anmelden (/konto/) und die Lizenz mit der freigegebenen Websiteadresse aktivieren. Im Kundenkonto einen API-Schlüssel für WordPress erstellen.
2. ZIP über Plugins > Installieren > Plugin hochladen installieren und aktivieren.
3. Einstellungen > Kundenfunk: HTTPS-Serveradresse ohne Pfad und den API-Schlüssel aus dem Kundenkonto eingeben. Keine zweite Lizenzaktivierung nötig.
4. Die Domain muss vom Betreiber exakt freigegeben sein (www ist eine eigene Origin). SIM, QR-Kopplung und Kanalmitgliedschaft werden in der Kundenansicht einzeln angezeigt.
5. Shortcode [kundenfunk] auf einer Seite einfügen. Einen Text-Testbeitrag veröffentlichen und „Jetzt synchronisieren“ wählen.
6. Automatische Synchronisation per echtem Server-Cron und Seitencache-Invalidierung testen.

== Externer Dienst ==
Erst nach ausdrücklicher Aktivierung verbindet sich das Plugin mit der eingegebenen Kundenfunk-API.
Das Plugin verwendet den API-Schlüssel der bereits aktivierten Website aus dem Kundenkonto. Der Lizenzschlüssel wird dort aktiviert und nicht erneut an WordPress übergeben.
Der private Websitezugang wird nur serverseitig gespeichert und nicht öffentlich ausgegeben.
Besucherbilder werden direkt vom Kundenfunk-Server abgerufen, wodurch dort übliche HTTP-Verbindungsdaten entstehen.
Dienstbedingungen und Datenverarbeitung erhält der Kunde vom Betreiber seiner Kundenfunk-Instanz.

== Grenzen dieses Pilotstands ==
Noch keine öffentliche WordPress.org-Veröffentlichung und kein automatischer Updatekanal.
Texte werden lokal gespeichert, Medien sind API-Links. Keine dauerhafte Offline-Medienkopie.
WP-Cron hängt ohne Server-Cron von Besuchen ab. Cacheplugins müssen den Hook kundenfunk_feed_updated anbinden.
Bei erkannter Zugangssperre wird der lokale Feed gelöscht; bei Netzfehlern maximal 24 Stunden Fallback.
Eine bereits extern gecachte Seite kann länger sichtbar bleiben, wenn der Betreiber keine Invalidierung einrichtet.
Deaktivierung entfernt den Cronjob. Lokale Inhalte und Konfiguration werden für Wiederaufnahme behalten.
Bei vollständiger Entfernung auch die kf_* Optionen löschen und den Site-Zugang zentral zurücksetzen.

== License ==
This plugin is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 2 of the
License, or (at your option) any later version. It is distributed without any warranty.
See https://www.gnu.org/licenses/gpl-2.0.html for the complete license text.
