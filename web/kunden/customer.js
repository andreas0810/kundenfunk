import {$,date,errorText,renderStatus,showQR,pairingRequest,withChannelFeedback,copy} from '/setup-status.js';
import {api,viewUser,loginURL} from '/user-auth.js';
import {mountWidgetEditor} from '/widget-editor.js';
let user=null,current=null,poll=null,pairPoll=null,loading=false;
let widgetLoaded=false;
async function loadWidget(){
 const data=await api('/v1/customer/widget');
 mountWidgetEditor($('widget-editor'),{settings:data.settings,previewURL:'/v1/customer/widget-preview',address:current.embed_url,save:settings=>api('/v1/customer/widget','POST',settings)});
 widgetLoaded=true;
}
const message=(text,tone='')=>{$('result').textContent=text;$('result').dataset.tone=tone;};
function display(data,fill=false){
 current=data;renderStatus(data);$('customer-name').textContent=data.customer_name;$('customer-website').textContent=data.site_origin;$('checked-at').textContent='Verbindungsstand geladen am '+date(data.observed_at);
 $('login-panel').hidden=true;$('customer-area').hidden=false;$('activation-panel').hidden=data.customer_activated;$('website-panel').hidden=!data.customer_activated;$('license').value='';
 $('account-name').textContent='Angemeldet als '+user.username;
 $('license-fingerprint').textContent='Lizenz: '+(data.key_suffix?'…'+data.key_suffix:'Bestehende Lizenz')+' · '+(data.customer_activated?'Aktiviert':'Aktivierung ausstehend');
 if(fill)$('origin').value=data.site_origin;
 $('embed-install').hidden=false;$('wordpress-install').hidden=false;$('widget-panel').hidden=!data.customer_activated;
 if(data.customer_activated&&!widgetLoaded)loadWidget().catch(error=>message(errorText(error),'error'));
 if(data.embed_url){const frame=document.createElement('iframe');frame.src=data.embed_url;frame.title='Neuigkeiten aus unserem WhatsApp-Kanal';frame.width='100%';frame.height='640';frame.loading='lazy';frame.referrerPolicy='no-referrer';frame.style.border='0';$('code').value=frame.outerHTML;}else $('code').value='';
 $('api-address').value=location.origin;updateControls(data);
 const states={waiting_activation:'Trage oben deinen Lizenzschlüssel ein. Erst danach kannst du WhatsApp koppeln und Nachrichten übernehmen.',waiting_sim:'Richte WhatsApp auf dem SIM-Handy ein, abonniere deinen Kanal und speichere unten Rufnummer und Kanallink.',reader_unavailable:'Der Kanalabruf ist momentan nicht erreichbar. Prüfe später erneut. Bleibt die Störung bestehen, kontaktiere den Kundenfunk-Betreiber.',waiting_pairing:'Erzeuge unten einen QR-Code und scanne ihn auf deinem SIM-Handy unter WhatsApp → Verknüpfte Geräte → Gerät hinzufügen. Danach erscheint hier „Gerät verbunden“.',waiting_channel:'Abonniere deinen Kanal mit der Kundenfunk-Nummer. Wähle anschließend unten „Kanal prüfen und Nachrichten abgleichen“.',sync_error:'Prüfe deine WhatsApp-Verbindung und starte „Kanal prüfen und Nachrichten abgleichen“ erneut.',waiting_first_message:'Veröffentliche einen neuen Textbeitrag in deinem Kanal und prüfe anschließend den Nachrichtenstand.',paused:'Deine Lizenz ist pausiert oder beendet. Kontaktiere den Kundenfunk-Betreiber für die Freigabe.'};
 if(states[data.system_state])$('next-step').textContent=states[data.system_state];
 if(fill){$('phone').value=data.reader_phone;$('channel').value=data.channel_url;$('sim-confirmed').checked=data.sim_confirmed;}
}
function updateControls(data){const allowed=data.customer_activated&&data.status==='active'&&data.system_state!=='paused'&&!!data.reader_phone;$('pair').disabled=!allowed||!data.reader_managed;$('pair-status').disabled=!allowed||!data.reader_managed;$('open-pairing').hidden=data.connection.connected===true||!data.customer_activated;$('open-pairing').disabled=!allowed||!data.reader_managed;$('connect').disabled=!allowed||!data.provider_configured||$('connect').getAttribute('aria-busy')==='true';$('create-key').querySelector('button').disabled=!data.customer_activated||data.system_state==='paused';}
async function refresh(fill=false){if(loading||!user)return;loading=true;try{display(await api('/v1/customer/status'),fill);}finally{loading=false;}}
function startPolling(){clearInterval(poll);poll=setInterval(()=>{if(!document.hidden)refresh().catch(error=>{message(errorText(error),'error');$('system-status').textContent='Status nicht aktuell';$('system-status').dataset.tone='error';});},20000);}
async function action(button,work){button.disabled=true;try{await work();}catch(error){message(errorText(error),'error');}finally{button.disabled=false;if(current)updateControls(current);}}
function showKey(key){$('new-key').value=key;$('key-handover').hidden=false;}
$('activate').addEventListener('submit',event=>{event.preventDefault();action(event.submitter,async()=>{message('Deine Lizenz wird aktiviert …');const data=await api('/v1/activate','POST',{license_key:$('license').value.trim(),site_origin:$('origin').value.trim()});$('license').value='';showKey(data.site_token);await refresh(true);await loadKeys();message('Lizenz aktiviert. Der erste Website-API-Schlüssel wird unten einmal angezeigt. Für die spätere Anmeldung verwendest du dein Benutzerkonto.','good');});});
$('refresh').addEventListener('click',event=>action(event.target,async()=>{await refresh();await loadKeys();message('Status und Schlüsselübersicht aktualisiert.','good');}));
$('copy-code').addEventListener('click',event=>action(event.target,async()=>{await copy($('code').value);message('Einbettungscode kopiert.','good');}));
$('copy-key').addEventListener('click',event=>action(event.target,async()=>{await copy($('new-key').value);message('API-Schlüssel kopiert.','good');}));
$('create-key').addEventListener('submit',event=>{event.preventDefault();action(event.submitter,async()=>{const data=await api('/v1/customer/keys','POST',{label:$('key-label').value});showKey(data.api_key);$('key-label').value='';await loadKeys();message('API-Schlüssel erstellt. Jetzt in deiner Website-Integration hinterlegen.','good');});});
async function loadKeys(){
 const data=await api('/v1/customer/keys'),list=$('key-list');list.replaceChildren();
 function item(label,id,created,revoked){
  const row=document.createElement('div');row.className='account-item';const description=document.createElement('p');description.textContent=label+' · '+(revoked?'Gesperrt am '+date(revoked):'Aktiv seit '+date(created));row.append(description);
  if(!revoked){const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent='Schlüssel sperren';button.addEventListener('click',()=>{if(!confirm('Diesen API-Schlüssel sperren? Integrationen mit diesem Schlüssel können danach keine Daten mehr abrufen. Dein Konto und die iframe-Anzeige bleiben gültig.'))return;action(button,async()=>{await api('/v1/customer/keys/'+id,'DELETE');$('new-key').value='';$('key-handover').hidden=true;await loadKeys();message('API-Schlüssel gesperrt.','good');});});row.append(button);}list.append(row);
 }
 if(data.legacy_key)item('Erster Website-Schlüssel · bestehende Installation','legacy',data.legacy_key.created_at,null);
 for(const key of data.keys)item(key.label+' · …'+key.key_suffix,key.id,key.created_at,key.revoked_at);
 if(!list.childElementCount){const p=document.createElement('p');p.textContent='Noch kein API-Schlüssel vorhanden. Aktiviere zuerst deine Lizenz.';list.append(p);}
}
$('setup').addEventListener('submit',event=>{event.preventDefault();action(event.submitter,async()=>{await api('/v1/customer/setup','POST',{phone:$('phone').value,channel_url:$('channel').value,sim_confirmed:$('sim-confirmed').checked});await refresh(true);message('SIM und Kanal gespeichert.','good');});});
async function pairing(start=false){clearTimeout(pairPoll);if(start)$('pair-message').textContent=showQR({status:'STARTING'});const data=await pairingRequest(api,'/v1/customer/reader-connection',start);$('pair-message').textContent=showQR(data);if(data.status==='WORKING'){await refresh();return;}if(['STARTING','SCAN_QR_CODE','DISCONNECTED'].includes(data.status))pairPoll=setTimeout(()=>pairing().catch(error=>{$('pair-message').textContent=errorText(error);}),5000);}
$('pair').addEventListener('click',event=>action(event.target,()=>pairing(true)));
$('open-pairing').addEventListener('click',event=>action(event.target,async()=>{$('connection-panel').scrollIntoView({block:'start'});await pairing(true);}));
$('pair-status').addEventListener('click',event=>action(event.target,()=>pairing()));
$('connect').addEventListener('click',event=>action(event.target,async()=>{const text=await withChannelFeedback(async()=>{const data=await api('/v1/customer/connect','POST',{});await refresh();if(!data.reader_verified)throw Error('reader_verification_required');if(data.sync.ok===false)throw Error(data.sync.error);return data.sync.skipped?'Kanal bestätigt. Der nächste Abgleich ist bereits eingeplant.':'Kanal bestätigt. '+data.sync.imported+' neue Nachrichten synchronisiert.';});message(text,'good');}));
async function logout(){await api('/v1/auth/logout','POST',{});location.replace(loginURL('customer'));}
$('logout').addEventListener('click',event=>action(event.target,logout));
$('switch-account').addEventListener('click',event=>action(event.target,logout));
viewUser('customer').then(async account=>{if(!account)return;user=account;$('area-label').textContent='Kunden-Frontend · Angemeldet als '+account.username;await refresh(true);await loadKeys();startPolling();}).catch(error=>message(errorText(error),'error'));
