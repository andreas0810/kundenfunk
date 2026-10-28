# Nutzungsrechte und kommerzieller Dienst

## GPL-2.0-or-later: Plugin und Feed-CSS

Das vollständige WordPress-Plugin unter `integrations/wordpress/kundenfunk/`
(PHP, JavaScript, CSS und mitgelieferte Dateien) sowie `web/feed-themes.css`
stehen unter **GNU General Public License, Version 2 oder jeder späteren Version**
(`GPL-2.0-or-later`). Die Plugin-Kopie des Stylesheets liegt unter
`integrations/wordpress/kundenfunk/assets/feed.css`.

Der vollständige Lizenztext liegt in [LICENSE-GPL-2.0.txt](LICENSE-GPL-2.0.txt)
und zusätzlich im Plugin unter `LICENSE.txt`. Der bearbeitbare Quellcode ist in
diesem Repository enthalten; das Plugin-ZIP enthält PHP, JavaScript und CSS direkt
als Quellcode und benötigt keinen separaten Kompilierungsschritt.

Die GPL erlaubt auch kommerzielle Nutzung und den Verkauf. Empfänger dürfen die
GPL-Dateien gemäß der Lizenz verwenden, verändern und weitergeben, auch gegen
Entgelt. Bei Weitergabe müssen Lizenz- und Urheberrechtshinweise erhalten bleiben;
Änderungen sind mit Datum kenntlich zu machen. Abgeleitete GPL-Werke müssen bei
Weitergabe wiederum unter der GPL samt entsprechendem Quellcode angeboten werden.
Die vollständigen Bedingungen und der Gewährleistungsausschluss stehen im Lizenztext.

Die Preise für Kundenfunk betreffen die vereinbarte Einrichtung, Freischaltung
des gehosteten Dienstes, SIM-Verbindung, Betrieb und Betreuung. Sie beschränken
keine GPL-Rechte an bereits erhaltenen Dateien. Eine GPL-Kopie des Plugins ist
kein Zugang zum gehosteten Kundenfunk-Dienst und enthält keine Kundenschlüssel.
Für diesen Dienst bleiben ein gültiger Zugang und die vereinbarten Leistungen nötig.

Der getrennte Backend-Dienst wird über HTTP angesprochen. Seine Quellen werden
mit diesem Repository nicht ausgeliefert und durch diese Erklärung nicht unter
die GPL gestellt. Fremder GPL-Code darf nicht ohne gesonderte Prüfung in den
proprietären Backend-Code übernommen werden.

## MIT: ursprüngliches Website-Widget und Eleventy-Loader

Die aus `wa-channel-bridge` übernommenen Dateien `web/wa-channel-feed.js` und
`web/eleventy-data/whatsapp-channel.js` stehen unter der MIT-Lizenz. Diese Rechte
bleiben unabhängig von der späteren Archivierung und privaten Sichtbarkeit des
ursprünglichen Repositorys bestehen. Für diese beiden Dateien gilt vollständig:

```text
MIT License

Copyright (c) 2026 Andreas Trabi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Bei Kopie dieser Dateien oder wesentlicher Teile muss dieser MIT-Text mit dem
Urheberrechtshinweis erhalten bleiben. Kommerzielle Nutzung ist eingeschlossen.

## Einbau in Kundenwebsites und KI-Werkzeuge

Die bereitgestellten HTML-/iframe-Einbaubeispiele und die Dateien unter
`integrations/embed/` und `integrations/tablet/` dürfen für die Einbindung von
Kundenfunk in eigene oder betreute Kundenwebsites kopiert, angepasst und als Teil
dieser Websites ausgeliefert werden, auch kommerziell. Diese Einbindung darf
durch KI- und Vibe-Coding-Werkzeuge umgesetzt werden. Bestehende Lizenz- und
Urheberrechtshinweise bleiben erhalten. Diese Erlaubnis umfasst keinen Verkauf
der Vorlagen als eigenständiges Vorlagenprodukt und keine Backendquellen.
Für das GPL-Feed-CSS gelten stattdessen die oben genannten GPL-Rechte.
Private API-Schlüssel gehören ausschließlich in geschützte Servereinstellungen;
in Browsercode wird nur die öffentliche Embed-Adresse verwendet.

Für die übrigen Dateien wurde keine allgemeine Open-Source-Lizenz festgelegt.
Ihre Veröffentlichung allein erteilt keine weitergehenden Nutzungsrechte.
Hinweise und Rechte Dritter bleiben bestehen; Markenrechte werden nicht eingeräumt.

## Grundlage

- [GNU GPL Version 2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
- [GNU FAQ: Verkauf von GPL-Software](https://www.gnu.org/licenses/gpl-faq.html#DoesTheGPLAllowMoney)
- [GNU FAQ: Betrieb auf einem Webserver](https://www.gnu.org/licenses/gpl-faq.html#UnreleasedMods)
