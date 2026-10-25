# Kundenfunk · Frontend und Integrationen

[![Public integrations](https://github.com/andreas0810/kundenfunk/actions/workflows/ci.yml/badge.svg)](https://github.com/andreas0810/kundenfunk/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/andreas0810/kundenfunk)](https://github.com/andreas0810/kundenfunk/releases)

Öffentlicher Quellstand der Kundenoberfläche, CSS-Dateien und Website-Integrationen.
Produktstand **0.6.0**, WordPress-Plugin **0.4.1**, Einbettungspaket **0.6.0**.

Kundenfunk zeigt Text und Bildunterschriften eines öffentlichen WhatsApp-Kanals auf
einer bestehenden Homepage. Das Plugin und die HTML-Einbettung verbinden sich mit
dem separat betriebenen Kundenfunk-Dienst. Es ist kein offizielles Meta-API-Produkt.

## Schnell einbauen

1. Persönliches Kundenkonto einrichten, Website-Lizenz aktivieren und Kanal koppeln.
2. Für WordPress das aktuelle ZIP aus den [Releases](https://github.com/andreas0810/kundenfunk/releases)
   oder den [Downloads](https://kundenfunk.pages.dev/versionen/) installieren.
3. Unter **Einstellungen → Kundenfunk** Dienstadresse und Website-API-Schlüssel
   hinterlegen. Den Lizenzschlüssel ausschließlich im Kundenkonto aktivieren.
4. `[kundenfunk]` in einen Shortcode-Block setzen und einen echten Kanalbeitrag prüfen.

Andere Websites verwenden den öffentlichen iframe-Code aus dem Kundenkonto.
Eigene Schlüssel, QR-Daten und Kundennachrichten gehören niemals in dieses Repository.

## Dokumentation

| Du möchtest … | Einstieg |
| --- | --- |
| das WordPress-Plugin installieren | [Pluginseite](https://kundenfunk.pages.dev/wordpress/) |
| Kunden anlegen und die Website abnehmen | [Betreiberleitfaden](https://kundenfunk.pages.dev/betreiber/) |
| Shortcodes, Widget oder Server-API einbauen | [Entwicklerinfos](https://kundenfunk.pages.dev/entwickler/) |
| den tatsächlichen Teststand sehen | [Kompatibilität](https://kundenfunk.pages.dev/kompatibilitaet/) |
| Fehler melden oder mitarbeiten | [Support](SUPPORT.md), [Mitwirken](CONTRIBUTING.md), [Sicherheit](SECURITY.md) |

## Quellaufteilung

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
| `web/compatibility.json`, `web/site-content.mjs` | Belegter Kompatibilitätsstand, Betreiber- und Plugininformationen |
| `integrations/embed/` | HTML-Einbettung für Websites und CMS |
| `integrations/tablet/` | iPad-Ansicht mit CSS und Nunjucks-Vorlage für Kundenwebsites |
| `integrations/wordpress/kundenfunk/` | WordPress-Plugin mit `[kundenfunk]`-Shortcode |
| `web/eleventy-data/` | Lokaler JSON-Loader für Eleventy |
| `test/wordpress.php`, `tools/check-public.mjs` | Isolierte Plugin-Fixtures und reproduzierbare Quellprüfungen |

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

## Kompatibilität und Grenzen

Geprüft mit WordPress **7.1.3** und PHP **8.3**, einschließlich echter
Shortcodes, Optionen und Cron. WordPress ab 6.0 und PHP ab 7.4 sind deklarierte
Mindestanforderungen; damit wird keine vollständige Versionsmatrix behauptet.
Die öffentliche HTML-Einbettung und Chromium-Browserabläufe sind geprüft.
CMS-/Page-Builder-Kombinationen und weitere Browser sind in der
[Kompatibilitätsübersicht](https://kundenfunk.pages.dev/kompatibilitaet/) eingeordnet.

Aktuell werden Texte und Bildunterschriften übernommen. Medienanhänge und private
Chats sind kein Website-Feed. WP-Cron benötigt für pünktliche feste Zeiten einen
Server-Cron; Seitencaches müssen ebenfalls aktualisiert werden. Das Plugin wird
derzeit per ZIP aktualisiert. Es ist noch nicht auf WordPress.org gelistet.

## Automatische Prüfungen

GitHub Actions prüft das öffentliche Manifest, reproduzierbare Informationsseiten,
JavaScript-Syntax, Komponentenstände, Lizenzen und interne Links. PHP-Fixtures
laufen ohne Netzwerkzugriff. Der offizielle WordPress Plugin Check läuft zusätzlich
als eigener Job. Die Workflows haben lesende Repository-Rechte; Kundenzugänge und
Deployment-Secrets werden nicht benötigt.

```sh
node tools/check-public.mjs
```

Weitere Schritte stehen in [CONTRIBUTING.md](CONTRIBUTING.md). Ein bestandener
automatischer Check ersetzt keine manuelle WordPress.org-Prüfung und keine Abnahme
einer konkreten Kundenwebsite.

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
