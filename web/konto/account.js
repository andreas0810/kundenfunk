import {api,loginURL} from '/user-auth.js';
import {$,errorText} from '/setup-status.js';
function readInvitation(){
 const value=new URLSearchParams(location.hash.slice(1)).get('invite');
 // Keep the one-time secret out of navigation history and referrers.
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);
 return value;
}
let invitation=readInvitation();
const next=new URLSearchParams(location.search).get('next');
const pathRole=location.pathname.startsWith('/admin/')?'admin':location.pathname.startsWith('/kunden/')?'customer':null;
const requestedRole=pathRole||(['admin','customer'].includes(next)?next:null);
const target=user=>user.role==='admin'?'/admin/':'/kunden/';
function describeRole(role,setup=false){
 const admin=role==='admin';
 document.documentElement.dataset.area=role||'neutral';
 document.title=admin?'Kundenfunk · Admin-Backend':role==='customer'?'Kundenfunk · Kunden-Frontend':'Kundenfunk · Anmeldung';
 document.querySelector('.brand').textContent=admin?'Kundenfunk · Admin-Backend':role==='customer'?'Kundenfunk · Kunden-Frontend':'Kundenfunk';
 document.querySelector('.brand').href=admin?'/admin/':role==='customer'?'/kunden/':'/';
 $('area-label').textContent=admin?'Adminbereich · Für Betreiber':role==='customer'?'Kundenbereich · Für Kundenfunk-Kunden':'Kundenfunk-Anmeldung';
 $('heading').textContent=setup?(admin?'Dein Betreiberkonto einrichten':'Dein Kundenkonto einrichten'):(admin?'Im Adminbereich anmelden':role==='customer'?'Im Kundenbereich anmelden':'Bei Kundenfunk anmelden');
 $('intro').textContent=admin?'Hier meldest du dich als Betreiber an, um Kunden einzurichten, Lizenzen freizugeben und WhatsApp-Verbindungen zu betreuen.':role==='customer'?'Hier meldest du dich mit deinem persönlichen Kundenkonto an. Du siehst deine Lizenz, deine Verbindung und die Einbindung für deine Website.':'Betreiber verwalten ihre Kunden im Adminbereich. Kunden aktivieren ihre eigene Lizenz und sehen ihren Kanalstatus im Kundenbereich.';
 $('role-help').textContent=admin?'Verwende dein Betreiberkonto. Kunden erhalten eigene Benutzerkonten und einen persönlichen Einrichtungslink.':role==='customer'?'Verwende deinen eigenen Kundennamen und dein Passwort. Beim ersten Mal öffnest du den persönlichen Einrichtungslink deines Betreibers.':'Nach der Anmeldung öffnet sich automatisch der zu deinem Konto gehörende Bereich.';
 $('setup-heading').textContent=admin?'Zugang für dich als Betreiber':'Dein persönlicher Kundenzugang';
}
const message=(text,tone='')=>{$('result').textContent=text;$('result').dataset.tone=tone;};
async function submit(button,work){button.disabled=true;message('Anfrage läuft …');try{await work();}catch(error){message(errorText(error),'error');}finally{button.disabled=false;}}
$('login').addEventListener('submit',event=>{event.preventDefault();submit(event.submitter,async()=>{const {user}=await api('/v1/auth/login','POST',{username:$('username').value,password:$('password').value});$('password').value='';location.replace(target(user));});});
$('setup').addEventListener('submit',event=>{event.preventDefault();submit(event.submitter,async()=>{if($('new-password').value!==$('repeat-password').value)throw Error('password_mismatch');const {user}=await api('/v1/auth/invitation/accept','POST',{token:invitation,password:$('new-password').value});$('new-password').value='';$('repeat-password').value='';location.replace(target(user));});});
$('logout').addEventListener('click',event=>submit(event.target,async()=>{await api('/v1/auth/logout','POST',{});$('signed-in').hidden=true;$('login-panel').hidden=false;message('Abgemeldet.','good');}));
async function start(){
 const current=invitation;
 if(current){$('login-panel').hidden=true;const data=await api('/v1/auth/invitation/inspect','POST',{token:current});if(invitation!==current)return;const setupPath=data.role==='admin'?'/admin/einrichten/':'/kunden/einrichten/';if(location.pathname!==setupPath){location.replace(setupPath+'#invite='+current);return;}describeRole(data.role,true);$('setup-username').textContent=data.username;$('setup-panel').hidden=false;return;}
 if(!pathRole&&requestedRole){location.replace(loginURL(requestedRole));return;}
 const {user}=await api('/v1/auth/session');
 if(invitation!==current)return;
 describeRole(requestedRole);
 if(user){$('login-panel').hidden=true;$('signed-in').hidden=false;$('signed-in-name').textContent='Angemeldet als '+user.username+' mit einem '+(user.role==='admin'?'Betreiberkonto':'Kundenkonto')+'.'+(requestedRole&&requestedRole!==user.role?' Für den gewählten Bereich melde dich mit einem passenden '+(requestedRole==='admin'?'Betreiberkonto':'Kundenkonto')+' an.':'');$('continue').href=target(user);$('continue').textContent=user.role==='admin'?'Deinen Adminbereich öffnen':'Deinen Kundenbereich öffnen';}
}
window.addEventListener('hashchange',()=>{
 invitation=readInvitation();$('setup-panel').hidden=true;$('signed-in').hidden=true;$('login-panel').hidden=false;
 $('new-password').value='';$('repeat-password').value='';$('setup-username').textContent='';message('');
 launch();
});
function launch(){const current=invitation;start().catch(error=>{if(invitation===current)message(errorText(error),'error');});}
describeRole(requestedRole);
launch();
