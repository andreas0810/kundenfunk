// Shared public presentation used by the customer website embed.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderPendingEmbed(){
 return `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kundenfunk-Verbindung</title><style>body{font:16px/1.6 system-ui;color:#183b35;background:#ece5dd;margin:0;padding:24px}h1{font-size:20px;line-height:1.3}p{max-width:45ch}.status{font-size:13px;color:#42594f;border-bottom:1px solid #bccbc2;padding-bottom:12px}</style><main><p class="status">Kundenfunk · Website verbunden</p><h1>Der Kanalabruf wird eingerichtet.</h1><p>Neue WhatsApp-Beiträge erscheinen hier, sobald die Kanalverbindung bestätigt ist.</p><p>Bis dahin findet ihr die Neuigkeiten direkt in unserem WhatsApp-Kanal.</p></main></html>`;
}

export function renderFeedEmbed(f,refresh=false){
const articles=f.posts.slice(0,12).map(p=>`<article><time>${esc(p.timestamp.slice(0,10))}</time><p>${esc(p.text)}</p>${p.media.filter(m=>m.type==='image').map(m=>`<img loading="lazy" src="${esc(m.url)}" alt="">`).join('')}</article>`).join('');
 return `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(f.channel.name)}</title>${refresh?'<meta http-equiv="refresh" content="30">':''}<style>body{font:16px/1.6 system-ui;margin:20px;color:#183b35}h1{font-size:20px}article{border-top:1px solid #ddd;padding:14px 0}p{white-space:pre-wrap;overflow-wrap:anywhere}img{max-width:100%;height:auto}time{font-size:13px;color:#54675f}</style><h1>${esc(f.channel.name)}</h1>${articles||'<p>Noch keine Beiträge.</p>'}</html>`;
}
