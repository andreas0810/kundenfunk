# Kundenfunk-Einbettung 0.2.0

Für Shopify, Wix, Squarespace, Joomla, Tilda sowie normale HTML-/Eleventy-Websites. Dies ist ein gemeinsames HTML-Paket mit plattformspezifischen Anleitungen, keine Sammlung nativer Store-Apps. WordPress hat ein eigenes ZIP-Plugin.

## Gemeinsamer Ablauf

1. Betreiber schaltet die exakte Website-Origin frei und übergibt einen Einrichtungslink für das Kundenkonto sowie den Lizenzschlüssel.
2. Kundenkonto über den Einrichtungslink mit eigenem Passwort aktivieren und anmelden. Danach `/kunden/` öffnen und Lizenz sowie Website-Origin eingeben. Erst danach ist der Nachrichtenabgleich freigeschaltet.
3. Das Kundenkonto ermöglicht den späteren Zugang. Für die iframe-Einbettung ist kein privater API-Schlüssel nötig.
4. In der Kundenansicht SIM-Vorbereitung, QR-Kopplung, Kanalbestätigung und Nachrichtenzahl prüfen. Generierten iframe-Code kopieren oder `EMBED_URL` in `einbettung.html` ersetzen.
5. Den Code entsprechend der folgenden Anleitung einsetzen. Nur die öffentliche Embed-Adresse landet im HTML.
6. Auf der veröffentlichten Domain prüfen. Vorschau-/Editor-Domains sind nicht automatisch freigegeben.

Vor erfolgreicher Readerprüfung bleibt die Anzeige gesperrt. Eine iframe-Anfrage und jeder Bildabruf zählen zum API-Limit. Die Embed-Adresse ist öffentlich sichtbar und widerrufbar; sie ist kein privater API-Schlüssel. Browser-Einbettung wird per CSP auf freigegebene Domains begrenzt. Das verhindert kein absichtliches serverseitiges Kopieren öffentlich angezeigter Inhalte.

## Shopify

Online Store → Themes → Customize: „Custom Liquid“ hinzufügen, sofern das Theme diese Sektion anbietet, und den iframe-Code einsetzen. Alternativ Theme-Code gezielt durch einen berechtigten Administrator ergänzen. Kein App-Store-Installationspaket und keine Berechtigung zum Zugriff auf Bestellungen nötig. [Shopify-Anleitung](https://help.shopify.com/en/manual/online-store/themes/customizing-themes), [offizielles Dawn-Beispiel](https://github.com/Shopify/dawn/blob/main/sections/custom-liquid.liquid)

## Wix

Im Editor „Embed Code“ → Website einbetten wählen und die HTTPS-Embed-URL eintragen; alternativ HTML-Element mit dem iframe-Code verwenden. Höhe auf ca. 640 px einstellen und mobil prüfen. Wix kann zusätzliche Rahmen-Domains verwenden: bei CSP-Blockade muss der Betreiber die tatsächlich beobachtete HTTPS-Origin über `frame-origins` ergänzen. Keine pauschale Wildcard freigeben. [Wix-Anleitung](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget)

## Squarespace

Code-Block im HTML-Modus verwenden und iframe-Code einsetzen. Der Tarif muss iframe-Code unterstützen; die Nutzung kann als Premiumfunktion eingeschränkt sein. Auf veröffentlichter Seite testen, nicht nur im Editor. [Code-Blöcke](https://support.squarespace.com/hc/en-us/articles/206543167-Code-blocks)

## Joomla

Eigenes HTML-/Custom-Modul erstellen, Code einfügen, Position und Seitenzuordnung wählen. Editor/Textfilter können iframes entfernen. Nur für den berechtigten Administrator gezielt konfigurieren; nicht global die Filter aller Benutzer abschalten. Kein nativer Joomla-Erweiterungsinstaller enthalten. [Custom-Modul](https://guide.joomla.org/modules-positions-menus/9-1-adding-text)

## Tilda

Blockbibliothek → Other → T123 „Embed HTML Code“, iframe-Code einfügen und veröffentlichen. Tarifberechtigung für eigenen HTML-Code prüfen. [Tilda-Anleitung](https://help.tilda.cc/html)

## Statische Websites

Code an der vorgesehenen Stelle in HTML oder Eleventy-Template einsetzen. Der iframe benötigt keinen privaten Schlüssel in der Browserausgabe. Einen vorhandenen Nachrichtenbereich erst ersetzen, wenn die Einbettung auf der veröffentlichten Domain geprüft wurde.

## Kompatibilität

Die HTML-Ausgabe ist geprüft. Tests in echten Shopify-/Wix-/Squarespace-/Joomla-/Tilda-Kundeninstallationen stehen aus. Der gleiche iframe lässt sich in einem HTML-Element in Webflow einsetzen; eine separate Prüfung steht ebenfalls aus. Tarif- und Editorvoraussetzungen beim jeweiligen Anbieter prüfen.
