# Mitwirken

Dieses Repository enthält die öffentlichen Kundenfunk-Oberflächen und Integrationen.
Backend, Verbindungsdienst und echte Kundendaten gehören in das getrennte private
Projekt. Bitte diese Grenze auch in Beispielen, Screenshots und Pull Requests beachten.

## Lokal prüfen

Node.js 24 oder neuer und Docker für die PHP-Prüfung verwenden:

```sh
node tools/check-public.mjs
docker run --rm --network none --mount type=bind,source="$PWD",target=/work,readonly -w /work php:8.3-cli php test/wordpress.php
```

Die statischen Seiten liegen unter `web/`. Preise, Versionsstände und
Kompatibilitätsangaben werden über JSON-Dateien gepflegt und mit
`node web/generate-site.mjs` erzeugt. Im Produktprojekt wird anschließend der
öffentliche Export einschließlich `PUBLIC-MANIFEST.json` erstellt. Ein Pull Request
darf deshalb einen veralteten Manifeststand melden; vor dem Zusammenführen muss
der Betreiber den geprüften Export neu erzeugen. Das Manifest nicht als Ersatz für
eine Codeprüfung verwenden.

Für eine Vorschau `web/` als Dokumentwurzel eines statischen Servers verwenden.
Die öffentliche Designvorschau benötigt den laufenden Kundenfunk-Dienst; eigene
Kontoinhalte werden nicht mit Testkonten ausgeliefert. Die PHP-Prüfung verwendet
ausschließlich synthetische Daten und keine Netzwerkverbindung.

## Änderungen einreichen

1. Einen kleinen, nachvollziehbaren Fehler oder Verbesserungswunsch beschreiben.
2. Änderung auf einem eigenen Branch umsetzen. Bestehende Lizenzhinweise erhalten.
3. Verhalten vorher/nachher und angemessene Prüfung im Pull Request dokumentieren.
4. Bei Oberflächen Desktop, 390-px-Mobilansicht, Tastaturfokus und Leer-/Fehlerzustände prüfen.
5. Bei Plugin-Änderungen PHP, Shortcodes, Zugriffsrechte, Nonces, Escaping, Cron und
   bestehende Einstellungen berücksichtigen. Keine stillen Schlüsselwechsel.

Eine veröffentlichte Paketversion wird nicht mit neuen Bytes überschrieben.
Plugin-Version, Stable tag und Versionsdaten müssen zusammenpassen. Bereits
veröffentlichte Git-Tags werden nicht verschoben. Die Produktversion kann vom
WordPress-Pluginstand abweichen.

Das WordPress-Plugin und sein Feed-CSS stehen unter GPL-2.0-or-later. Für weitere
Dateien gelten die Hinweise in [COPYRIGHT.md](COPYRIGHT.md). Ein Beitrag ändert die
Lizenz anderer Projektteile nicht und setzt Rechte am beigesteuerten Material voraus.

Für Sicherheitsprobleme gilt [SECURITY.md](SECURITY.md); keine Schwachstelle oder
echten Zugangsdaten in einem öffentlichen Issue veröffentlichen.
