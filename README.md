# Kundenfunk · Frontend und Integrationen

Öffentlicher Quellstand der Kundenoberfläche, CSS-Dateien und Website-Integrationen.
Produktstand **0.5.0**, WordPress-Plugin **0.4.0**, Einbettungspaket **0.5.0**.

| Dateien | Verwendung |
| --- | --- |
| `web/kunden/` | Kundenoberfläche mit Lizenz-, SIM-, QR- und Nachrichtenstatus |
| `web/konto/`, `web/user-auth.js` | Anmeldeoberfläche und HTTP-Client |
| `web/backend.css` | Gestaltung und Bereichsfarben |
| `web/wa-channel-feed.js`, `web/demo.html` | Website-Widget und Demo mit erfundenen Daten |
| `web/embed-view.js` | Öffentliche HTML-/CSS-Darstellung der Website-Einbettung |
| `web/widget-editor.js`, `web/feed-presentation.js` | Theme-, Skin- und Layoutauswahl mit Vorschau |
| `web/preise/`, `web/versionen/`, `web/entwickler/` | Preise, Versionshistorie und Einbauanleitungen |
| `web/pricing.json`, `web/releases.json`, `web/generate-site.mjs` | Öffentliche Preis- und Versionsdaten sowie Seitengenerator |
| `integrations/embed/` | HTML-Einbettung für Websites und CMS |
| `integrations/tablet/` | iPad-Ansicht mit CSS und Nunjucks-Vorlage für Kundenwebsites |
| `integrations/wordpress/kundenfunk/` | WordPress-Plugin mit `[kundenfunk]`-Shortcode |
| `web/eleventy-data/` | Lokaler JSON-Loader für Eleventy |

Kundenbereich: https://kundenfunk.pages.dev/kunden/
Produktseite und öffentlicher Konfigurator: https://kundenfunk.pages.dev/

[Preise](https://kundenfunk.pages.dev/preise/) ·
[Versionshistorie und Downloads](https://kundenfunk.pages.dev/versionen/) ·
[Entwicklerinfos und Einbauhilfe](https://kundenfunk.pages.dev/entwickler/)

Die Plugin-/Widget-Freischaltung kostet einmalig **19 EUR je Website**. Hinzu kommen
die Einrichtung (Start 29 EUR, Betreut 49 EUR) und der monatliche Dienstbetrieb
(12,90 EUR bzw. 19,90 EUR). Die Freischaltung wird für beide Einbauwege auf derselben
Website nur einmal berechnet; GPL-Rechte am Plugin bleiben bestehen. Verbindlicher
Umfang und Steuerangaben werden im individuellen Angebot bestätigt.

Zur Einrichtung den persönlichen Einrichtungslink des Betreibers öffnen, ein Passwort
vergeben und die bereitgestellte Lizenz aktivieren. Anschließend WhatsApp und Kanal
verbinden und den Einbettungscode oder das WordPress-Plugin verwenden.
Ausführliche [Website-Anleitung](integrations/embed/README.md) und
[Widget-Dokumentation](web/README.md).

Die Kundenoberfläche benötigt den Kundenfunk-Dienst. Die Widget-Demo funktioniert
mit einem gewöhnlichen statischen HTTP-Server und den enthaltenen Beispieldaten.
API- und Lizenzschlüssel gehören in geschützte Einstellungen und dürfen nicht
committet werden.

Die Informationsseiten lassen sich mit Node.js ohne zusätzliche Pakete aus dem
Repository neu erzeugen: `node web/generate-site.mjs`. Ein statischer HTTP-Server
mit `web/` als Dokumentwurzel zeigt sie und den öffentlichen Konfigurator an.
Funktionen mit eigenen Kundeninhalten benötigen weiterhin den Kundenfunk-Dienst.

## Versionen und Änderungen

Änderungen sind über [Commits](https://github.com/andreas0810/kundenfunk/commits/main/)
und [Versionsmarken](https://github.com/andreas0810/kundenfunk/tags) nachvollziehbar.
Die Git-Historie beginnt am 22.10.2026; frühere Entwicklung wird dadurch nicht
nachträglich als Git-Historie dargestellt. [Änderungsprotokoll](CHANGELOG.md).

`PUBLIC-MANIFEST.json` nennt alle veröffentlichten Dateien mit SHA-256-Prüfsummen.
Der Betreiber exportiert diese Dateien anhand einer festen Freigabeliste; Backend
und Betreiberverwaltung werden in einem separaten privaten Repository gepflegt.

## Lizenz

Das WordPress-Plugin steht unter GPL-2.0-or-later, siehe dessen `readme.txt`.
Die übrigen Dateien sind öffentlich einsehbar; eine allgemeine Open-Source-Lizenz
wurde dafür bisher nicht erteilt. Siehe [COPYRIGHT.md](COPYRIGHT.md).
