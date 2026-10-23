export const $ = id => document.getElementById(id);
export const date = value => value ? new Date(value).toLocaleString('de-DE') : 'Noch kein Abgleich';
export const errors = {
 unauthorized:'Dieser technische Zugang ist ungültig.',
 login_required:'Deine Anmeldung ist abgelaufen. Bitte erneut anmelden.',
 invalid_credentials:'Benutzername oder Passwort stimmen nicht.',
 invalid_username:'Der Benutzername braucht 2 bis 80 Zeichen: Buchstaben, Zahlen, Punkt, @, Bindestrich oder Unterstrich.',
 invalid_password:'Das Passwort braucht mindestens 12 Zeichen und darf höchstens 72 UTF-8-Bytes lang sein.',
 password_mismatch:'Die beiden Passwörter stimmen nicht überein.',
 invalid_invitation:'Der Einrichtungslink ist ungültig, abgelaufen oder bereits verwendet. Bitte einen neuen Link vom Admin anfordern.',
 auth_rate_limited:'Zu viele Versuche. Bitte einige Minuten warten und erneut versuchen.',
 forbidden:'Dieses Konto hat keinen Zugriff auf diesen Bereich. Melde dich mit dem passenden Konto an.',
 cross_origin_request:'Die Anfrage muss aus deinem geöffneten Kundenfunk-Konto kommen. Bitte die Seite neu laden.',
 username_taken:'Dieser Benutzername ist bereits vergeben.',
 user_disabled:'Dieses Konto ist gesperrt. Aktiviere es zuerst wieder.',
 last_admin:'Der letzte eingerichtete Admin kann nicht gesperrt werden.',
 invalid_widget_settings:'Bitte Theme, Skin, Layout und Aktualisierungsintervall prüfen.',
 invalid_key_label:'Bitte einen Namen für den API-Schlüssel mit höchstens 80 Zeichen eingeben.',
 api_key_limit:'Für diese Website sind bereits zehn API-Schlüssel aktiv. Sperre zuerst einen nicht mehr benötigten Schlüssel.',
 api_key_not_found:'Dieser API-Schlüssel existiert nicht mehr oder gehört zu einem anderen Kunden.',
 operator_not_configured:'Das Admin-Passwort ist auf diesem Server noch nicht hinterlegt.',
 admin_rate_limited:'Zu viele Anmeldeversuche. Bitte eine Minute warten.',
 invalid_license:'Der Lizenzschlüssel ist ungültig. Bitte vollständig kopieren.',
 invalid_site_token:'Dieser Kundenzugang ist ungültig. Lade den aktuellen privaten Installationsbeleg oder lass die Installation vom Admin zurücksetzen.',
 receipt_wrong_backend:'Dieser Installationsbeleg gehört zu einem anderen Kundenfunk-Server. Öffne die Kundenansicht auf dem Server aus deinem Beleg.',
 invalid_receipt:'Der Installationsbeleg ist ungültig. Bitte die ursprüngliche JSON-Datei laden.',
 site_origin_mismatch:'Diese Website stimmt nicht mit der freigeschalteten Adresse überein. Verwende genau die Adresse aus deiner Einladung.',
 site_already_activated:'Diese Lizenz ist bereits aktiviert. Lade deinen Kontostatus erneut.',
 invalid_site_origin:'Bitte eine vollständige Websiteadresse eingeben.',
 origin_without_path_required:'Gib nur die Websiteadresse ohne Unterseite ein, zum Beispiel https://deine-website.de.',
 https_required:'Die Websiteadresse muss mit https:// beginnen.',
 invalid_phone_e164:'Bitte die vollständige Rufnummer mit Ländervorwahl eingeben, zum Beispiel +49 ….',
 invalid_channel_url:'Bitte den öffentlichen WhatsApp-Kanallink eingeben: https://whatsapp.com/channel/…',
 invalid_sim_confirmation:'Die SIM-Bestätigung konnte nicht gespeichert werden. Bitte erneut versuchen.',
 tenant_not_found:'Kundenkennung und Kundenname fehlen oder sind ungültig.',
 license_already_exists:'Für diesen Kunden gibt es bereits eine Lizenz. Wähle den Kunden aus der Liste.',
 customer_activation_required:'Der Kunde muss zuerst seinen Lizenzschlüssel im Kundenbereich eintragen. Bis dahin bleibt die Synchronisation gesperrt.',
 managed_reader_not_configured:'Der WhatsApp-Leser ist auf diesem Server noch nicht angebunden. Der Admin muss die Anbindung einrichten, bevor ein QR-Code erzeugt werden kann.',
 managed_reader_unavailable:'Der WhatsApp-Leser ist momentan nicht erreichbar. Die gespeicherte Einrichtung bleibt erhalten.',
 reader_provider_not_configured:'Der WhatsApp-Leser ist noch nicht angebunden. Bitte den Admin kontaktieren.',
 reader_provider_unavailable:'Der WhatsApp-Leser ist momentan nicht erreichbar. Bitte erneut prüfen.',
 reader_provider_error:'Der WhatsApp-Leser konnte die Verbindung nicht prüfen. Bitte erneut prüfen oder den Admin kontaktieren.',
 reader_not_connected:'Das WhatsApp-Gerät ist nicht verbunden. Prüfe zuerst die QR-Kopplung.',
 reader_channel_lookup_failed:'WhatsApp konnte den Kanallink nicht auflösen. Prüfe den gespeicherten Kanallink und versuche die Kanalprüfung erneut.',
 reader_channel_unavailable:'WhatsApp liefert keine gültigen Daten für diesen Kanal. Prüfe den gespeicherten Kanallink.',
 reader_channel_subscription_failed:'Das Gerät ist verbunden, aber WhatsApp hat den Nachrichtenempfang für den Kanal noch nicht bestätigt. Bitte die Kanalprüfung erneut starten.',
 reader_history_failed:'Der Kanal ist bestätigt, aber WhatsApp konnte die bisherigen Nachrichten nicht liefern. Bitte den Abgleich erneut versuchen.',
 reader_phone_required:'Zuerst die Rufnummer der Kundenfunk-SIM speichern.',
 reader_pairing_required:'WhatsApp ist noch nicht gekoppelt. Erzeuge einen QR-Code und scanne ihn mit dem Handy der Kundenfunk-SIM.',
 reader_phone_not_connected:'Die verbundene WhatsApp-Nummer stimmt nicht mit der Kundenfunk-SIM überein. Bitte die Kopplung prüfen.',
 reader_not_in_channel:'Die Kundenfunk-Nummer muss den angegebenen WhatsApp-Kanal abonnieren. Danach erneut prüfen.',
 channel_membership_required:'WhatsApp bestätigt noch kein Kanalabo für die gekoppelte Kundenfunk-Nummer. Öffne den gespeicherten Kanallink auf dem SIM-Handy, tippe auf „Abonnieren“ bzw. „Folgen“ und starte diese Prüfung erneut.',
 reader_reset_required:'Nummer oder Kanal wurden geändert. Trenne zuerst die bisherige WhatsApp-Verknüpfung und kopple sie dann erneut.',
 reader_configuration_changed:'Die Einrichtung wurde während der Prüfung geändert. Lade den aktuellen Stand und prüfe erneut.',
 reader_verification_required:'Die Kanalverbindung muss noch bestätigt werden.',
 reader_pool_full:'Alle verfügbaren WhatsApp-Verbindungen sind belegt. Bitte den Admin kontaktieren.',
 license_inactive:'Die Lizenz ist pausiert oder beendet. Bitte den Admin kontaktieren.',
 license_expired:'Die Lizenz ist abgelaufen. Bitte den Admin kontaktieren.',
 activation_rate_limit:'Zu viele Aktivierungsversuche. Bitte eine Minute warten.',
 request_limit_reached:'Das Abrufkontingent ist ausgeschöpft.',
 wrong_phone:'Es wurde eine andere WhatsApp-Nummer gekoppelt. Trenne die Verknüpfung und scanne mit der Kundenfunk-Nummer.',
 not_started:'Noch kein Nachrichtenabgleich.',
 reader_unavailable:'Der WhatsApp-Leser ist momentan nicht erreichbar.',
 reader_delivery_failed:'Die Nachrichtenübernahme ist gestört. Die Verbindung und die wartenden Nachrichten werden automatisch erneut geprüft.',
 reader_channel_check_failed:'Die automatische Kanalprüfung konnte das Abo noch nicht bestätigen. Öffne die Kundenverbindung und prüfe den Kanal erneut.',
 reader_watchdog_failed:'Die automatische Verbindungsprüfung konnte nicht abgeschlossen werden. Sie wird erneut versucht.',
 sync_configuration_changed:'Die Einrichtung hat sich beim Abgleich geändert. Bitte erneut prüfen.'
};
export function errorText(error){
 if(['TypeError','TimeoutError','AbortError'].includes(error?.name))return 'Der Server antwortet gerade nicht. Bitte erneut versuchen.';
 const code=typeof error==='string'?error:error?.message;
 return errors[code]||'Die Anfrage ist fehlgeschlagen. Bitte den aktuellen Status laden und erneut versuchen.';
}
export const stateLabels = {paused:'Pausiert oder beendet',waiting_activation:'Wartet auf Kundenaktivierung',waiting_sim:'SIM vorbereiten',reader_unavailable:'WhatsApp-Leser nicht erreichbar',waiting_pairing:'QR-Kopplung ausstehend',waiting_channel:'Kanalprüfung ausstehend',sync_error:'Nachrichtenabgleich gestört',waiting_first_message:'Wartet auf ersten Beitrag',connection_not_checked:'Verbindung noch prüfen',active:'Kundenfunk verbunden'};
export function badge(id,text,tone){$(id).textContent=text;$(id).dataset.tone=tone;}
export function renderStatus(data){
 badge('system-status',stateLabels[data.system_state]||'Einrichtung ausstehend',data.system_state==='active'?'good':['paused','reader_unavailable','sync_error'].includes(data.system_state)?'error':'waiting');
 badge('license-status',data.status!=='active'||data.system_state==='paused'?'Pausiert / beendet':data.customer_activated?'Vom Kunden aktiviert':'Noch nicht aktiviert',data.customer_activated&&data.system_state!=='paused'?'good':'waiting');
 $('license-detail').textContent=data.customer_activated?'Lizenzschlüssel eingetragen am '+date(data.activated_at):'Der Kunde muss den Lizenzschlüssel in seiner Ansicht eintragen. Synchronisation ist bis dahin gesperrt.';
 badge('sim-status',data.sim_confirmed?'Vorbereitung bestätigt':data.reader_phone?'Rufnummer gespeichert':'Noch nicht vorbereitet',data.sim_confirmed?'good':'waiting');
 $('sim-detail').textContent=(data.reader_phone||'Noch keine Rufnummer')+(data.sim_confirmed?' · am '+date(data.sim_confirmed_at):'')+'. Die SIM-Vorbereitung wird am Handy bestätigt; der Mobilfunkempfang wird nicht automatisch gemessen.';
 const connected=data.connection.connected===true;
 badge('qr-status',connected?'Gerät verbunden':data.connection.status==='UNAVAILABLE'?'Nicht erreichbar':data.connection.status==='NOT_CHECKED'?'Noch nicht geprüft':data.connection.status==='SCAN_QR_CODE'?'QR-Code scannen':data.connection.status==='PAIRING_EXPIRED'?'QR-Code abgelaufen':'Nicht verbunden',connected?'good':data.connection.status==='UNAVAILABLE'?'error':'waiting');
 $('qr-detail').textContent=connected?'WhatsApp meldet die passende Kundenfunk-Nummer als verbunden. Geprüft am '+date(data.connection.checked_at):data.connection.error?errorText(data.connection.error):'QR-Code mit WhatsApp → Verknüpfte Geräte → Gerät hinzufügen scannen.';
 badge('channel-status',data.reader_verified?(connected?'Kanal bestätigt':'Zuletzt bestätigt'):'Bestätigung ausstehend',data.reader_verified&&connected?'good':'waiting');
 $('channel-detail').textContent=data.reader_verified?'Nummer und Kanalmitgliedschaft zuletzt geprüft am '+date(data.last_checked_at)+'.':data.channel_url?'Den Kanal mit der Kundenfunk-Nummer abonnieren, dann „Kanal prüfen und Nachrichten abgleichen“ wählen.':'Öffentlichen WhatsApp-Kanallink speichern.';
 $('messages-count').textContent=Number(data.messages_synced).toLocaleString('de-DE')+(data.messages_synced===1?' Nachricht':' Nachrichten');
 $('messages-detail').textContent='Letzter erfolgreicher Abgleich: '+date(data.sync.last_success_at)+(data.sync.last_error&&data.sync.last_error!=='not_started'?' · '+errorText(data.sync.last_error):'')+'. Gezählt werden gespeicherte Kanalnachrichten; doppelte Übertragungen erhöhen die Zahl nicht.';
 const next={paused:'Bitte die Lizenz freigeben oder verlängern.',waiting_activation:'Lizenzschlüssel erstellen und an den Kunden geben. Der Kunde trägt ihn in seiner Kundenansicht ein.',waiting_sim:'Die Kundenfunk-SIM im Handy einsetzen, WhatsApp mit dieser Nummer einrichten und die Rufnummer speichern.',reader_unavailable:'Die Anbindung des WhatsApp-Lesers prüfen. Danach kann der QR-Code erzeugt und die Verbindung geprüft werden.',waiting_pairing:'Einen QR-Code erzeugen und mit WhatsApp auf dem Handy der Kundenfunk-SIM scannen.',waiting_channel:'Den Kundenkanal mit der Kundenfunk-Nummer abonnieren und danach „Kanal prüfen und Nachrichten abgleichen“ wählen.',sync_error:'Verbindung und Kanal prüfen, danach den Nachrichtenabgleich erneut starten.',waiting_first_message:'Die Verbindung vorbereiten bzw. prüfen und einen neuen Textbeitrag im Kundenkanal veröffentlichen. Die Nachrichtenzahl steigt nach erfolgreicher Übernahme.',connection_not_checked:'Den aktuellen Verbindungsstatus laden.',active:'Kundenfunk ist verbunden. Neue Kanalbeiträge werden übernommen. Zum Abschluss den Einbettungscode auf der Website einsetzen und einen Testbeitrag prüfen.'};
 $('next-step').textContent=next[data.system_state]||'Den aktuellen Status laden.';
 const done=[true,data.customer_activated,data.sim_confirmed,connected,data.reader_verified&&data.messages_synced>0];
 document.querySelectorAll('[data-step]').forEach((item,i)=>{item.dataset.done=String(done[i]);item.dataset.current=String(!done[i]&&done.slice(0,i).every(Boolean));});
 $('pair').textContent=connected?'Verbindung prüfen':'QR-Code anzeigen / erneuern';
 if(connected){$('qr').hidden=true;$('qr').removeAttribute('src');$('pair-message').textContent=data.reader_verified?'Gerät und Kanal sind bestätigt. Du brauchst keinen QR-Code. Der aktuelle Nachrichtenstand steht in der Übersicht.':'Das Gerät ist bereits verbunden. Du brauchst keinen QR-Code. Jetzt den Kanal prüfen und Nachrichten abgleichen.';}
 else if(!['STARTING','SCAN_QR_CODE','NOT_CHECKED'].includes(data.connection.status)){
  $('qr').hidden=true;$('qr').removeAttribute('src');
  $('pair-message').textContent=data.connection.status==='PAIRING_EXPIRED'?'Der QR-Code ist abgelaufen. Wähle „QR-Code anzeigen / erneuern“, um einen neuen Code anzufordern.':data.connection.status==='DISCONNECTED'?'Die WhatsApp-Verbindung ist unterbrochen. Bitte die Kopplung erneut prüfen.':data.connection.error?errorText(data.connection.error):'Noch kein Gerät verbunden. Speichere Rufnummer und Kanal und wähle „QR-Code anzeigen / erneuern“.';
 }
 else if($('qr').hidden&&data.connection.status==='SCAN_QR_CODE')$('pair-message').textContent='Ein QR-Code ist bereit. Wähle „QR-Code anzeigen / erneuern“, um ihn hier anzuzeigen.';
}
export function showQR(data){
 const qr=$('qr');qr.hidden=true;qr.removeAttribute('src');
 if(data.status==='WORKING')return 'Das Gerät ist bereits mit WhatsApp verbunden. Du brauchst keinen QR-Code. Jetzt den Kanal prüfen und Nachrichten abgleichen.';
 if(typeof data.qr==='string'&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(data.qr)){qr.src=data.qr;qr.hidden=false;return 'Diesen QR-Code mit WhatsApp auf dem Handy der Kundenfunk-SIM scannen. Der Status aktualisiert sich automatisch.';}
 return {STARTING:'Die Kopplung startet. Der QR-Code erscheint nach wenigen Sekunden.',SCAN_QR_CODE:'Der QR-Code wird vorbereitet. Bitte kurz warten.',NOT_CONFIGURED:'Noch keine Kopplung gestartet. Wähle „QR-Code anzeigen / erneuern“.',PAIRING_EXPIRED:'Der QR-Code ist abgelaufen. Wähle „QR-Code anzeigen / erneuern“, um einen neuen Code anzufordern.',WRONG_PHONE:errors.wrong_phone,LOGGED_OUT:'WhatsApp wurde abgemeldet. Trenne die alte Verknüpfung und erzeuge einen neuen QR-Code.',DISCONNECTED:'Die WhatsApp-Verbindung ist unterbrochen. Eine Wiederverbindung wird versucht.',STOPPED:'Die Verbindung ist gestoppt. Wähle „QR-Code anzeigen / erneuern“.'}[data.status]||errorText(data.error);
}
export async function pairingRequest(api,path,start=false,body={}){
 try{return await api(path,start?'POST':'GET',start?body:undefined);}
 catch(error){if(error.status===409&&['PAIRING_EXPIRED','NOT_CONFIGURED','STOPPED'].includes(error.data?.status))return error.data;throw error;}
}
export async function withChannelFeedback(work){
 const button=$('connect'),label=button.textContent,notice=$('connect-message');
 button.textContent='Kanal wird geprüft …';button.setAttribute('aria-busy','true');notice.textContent='Kanal und Nachrichten werden geprüft …';notice.dataset.tone='';
 try{const text=await work();notice.textContent=text;notice.dataset.tone='good';return text;}
 catch(error){notice.textContent=errorText(error);notice.dataset.tone='error';throw error;}
 finally{button.textContent=label;button.removeAttribute('aria-busy');}
}
export async function copy(value){await navigator.clipboard.writeText(value);}
 // SIM readiness is a human confirmation; WhatsApp liveness is observed separately.
