import {presentation} from './feed-presentation.js';
// Shared public presentation used by the customer website embed.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderPendingEmbed(){
 return `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kundenfunk-Verbindung</title><style>body{font:16px/1.6 system-ui;color:#183b35;background:#ece5dd;margin:0;padding:24px}h1{font-size:20px;line-height:1.3}p{max-width:45ch}.status{font-size:13px;color:#42594f;border-bottom:1px solid #bccbc2;padding-bottom:12px}</style><main><p class="status">Kundenfunk · Website verbunden</p><h1>Der Kanalabruf wird eingerichtet.</h1><p>Neue WhatsApp-Beiträge erscheinen hier, sobald die Kanalverbindung bestätigt ist.</p><p>Bis dahin findet ihr die Neuigkeiten direkt in unserem WhatsApp-Kanal.</p></main></html>`;
}

export function renderFeedEmbed(f,refresh=false,input={},demo=false){
 const options=presentation(input);
 const articles=f.posts.slice(0,options.limit).map(p=>`<article><time datetime="${esc(p.timestamp)}">${esc(p.timestamp.slice(0,10))}</time>${p.media.filter(m=>m.type==='image').map(m=>`<img loading="lazy" src="${esc(m.url)}" alt="">`).join('')}<p>${esc(p.text)}</p></article>`).join('');
 const empty='<div class="kf-empty empty"><span class="kf-channel-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="m7 13 19-7v20L7 19zm3 7 3 7H9l-2-8M4 13v6"/></svg></span><h2>Noch keine Beiträge</h2><p>Neue Kanalbeiträge erscheinen<br>automatisch hier.</p></div>';
 const channelURL=/^https:\/\/(?:www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9]+\/?$/.test(f.channel.url||'')?f.channel.url:null;
 const header=options.skin==='none'?`<h1 class="kf-feed-title">${esc(f.channel.name)}</h1>`:`<header class="kf-header"><span class="kf-avatar" aria-hidden="true">◌</span><div><h1>${esc(f.channel.name)}</h1><small>Öffentlicher WhatsApp-Kanal</small></div></header>`;
 return `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(f.channel.name)}</title>${refresh?'<meta http-equiv="refresh" content="'+options.refresh_minutes*60+'">':''}<link rel="stylesheet" href="/feed-themes.css"><style>html{height:100%;overscroll-behavior-y:contain}body{margin:0;background:transparent}</style><div class="kf-embed kf-theme-${options.theme} kf-skin-${options.skin} kf-layout-${options.layout}"><section class="kf-device"><div class="kf-display">${header}<main class="kf-posts">${demo?'<p class="kf-demo-label">Vorschau mit erfundenen Beispieldaten</p>':''}${articles||empty}</main>${channelURL?'<footer class="kf-footer"><a class="kf-follow" href="'+esc(channelURL)+'" target="_blank" rel="noopener noreferrer">Auf WhatsApp folgen ↗</a></footer>':''}</div></section></div></html>`;
}
