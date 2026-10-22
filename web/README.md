# Kundenfunk-Kundenoberfläche und Website-Widget

`kunden/` enthält die grüne Kundenansicht. `konto/` und `user-auth.js` stellen die
Anmeldeoberfläche bereit; sie benötigen den Kundenfunk-Dienst auf derselben Origin.
`backend.css` enthält das gemeinsame CSS einschließlich der Farben beider Bereiche.

## Website einbinden

Den fertigen iframe-Code in der aktivierten Kundenansicht kopieren und in einen
HTML-Block der Website einsetzen. Die öffentliche Einbettungsadresse enthält
keinen privaten API-Schlüssel. Eine Freigabe der Websiteadresse ist erforderlich.
Anleitung: [Einbettung](../integrations/embed/README.md).

Für WordPress steht das [Kundenfunk-Plugin](../integrations/wordpress/kundenfunk/)
mit dem Shortcode `[kundenfunk]` zur Verfügung. Der API-Schlüssel wird ausschließlich
in den privaten Plugin-Einstellungen gespeichert.

## Eigenes Feed-Widget

Das unabhängige Web Component `wa-channel-feed.js` zeigt JSON im Format von
`sample-feed.json` an. `demo.html` verwendet ausschließlich synthetische Beispieldaten.

```html
<wa-channel-feed src="./sample-feed.json" limit="10" locale="de-DE"></wa-channel-feed>
<script src="./wa-channel-feed.js"></script>
```

`src` bezeichnet eine frei lesbare JSON-Datei. Für fremde Origins muss der
Feedanbieter passende CORS-Header setzen. Private API-Schlüssel gehören niemals
in diese Browser-Einbindung. Das Shadow-DOM-Styling steht im `STYLE`-Block des Widgets.
`limit="0"` zeigt alle Beiträge, `locale` bestimmt die Datumsdarstellung.

Für Eleventy liest `eleventy-data/whatsapp-channel.js` eine lokale JSON-Datei zur
Buildzeit. `WA_FEED_PATH` legt ihren Pfad fest. Zugangsdaten bleiben außerhalb des
veröffentlichten HTML und außerhalb dieses Repositories.
