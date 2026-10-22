# Kundenfunk in einer Tabletansicht

Wiederverwendbare iPad-Anmutung mit schmalem Rahmen, Kanalliste und Nachrichtenbereich.
Auf kleinen Bildschirmen wird ausschließlich der Kanal angezeigt. Die Gestaltung
orientiert sich an [WhatsApp auf dem iPad](https://blog.whatsapp.com/its-here-introducing-whatsapp-for-ipad).
Dies ist eine Website-Einbettung öffentlicher Kanalbeiträge.

Für Eleventy/Nunjucks die Vorlage in den Include-Ordner kopieren, das CSS in das
Website-Stylesheet einbinden und das kleine Uhrzeit-Skript mit `defer` laden.

```njk
{% set tablet = {
  name: "Beispielverein",
  avatar: "/bilder/vereinslogo.jpg",
  embedUrl: "ÖFFENTLICHE_EMBED_URL_AUS_DER_KUNDENANSICHT",
  channelUrl: "WHATSAPP_KANALLINK"
} %}
{% include "kundenfunk-tablet.njk" %}
```

`embedUrl` ist die öffentliche iframe-Adresse aus dem Kundenkonto. Keine privaten
API- oder Lizenzschlüssel einsetzen. Die Website muss für die Einbettung freigegeben
sein. Die Vorschau zeigt ausschließlich tatsächlich übernommene Kanalbeiträge.
Links öffnen den echten WhatsApp-Kanal; es werden keine privaten Chats oder erfundenen
Nachrichten angezeigt. CSS-Klassen beginnen mit `wa-` und gelten innerhalb `.wa-tablet`.
