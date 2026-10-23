// Public presentation contract shared by the editor, widget and embed renderer.
export const themes={classic:'WhatsApp',light:'Hell',dark:'Dunkel',editorial:'Magazin'};
export const skins={none:'Ohne Rahmen',iphone:'Smartphone · Schwarz',android:'Smartphone · Silber',ipad:'Tablet · iPad'};
export const layouts={list:'Nachrichten',cards:'Karten',compact:'Kompakt'};
export const refreshIntervals=[15,30,60,180];
export const defaultPresentation=Object.freeze({theme:'classic',skin:'none',layout:'list',limit:12,refresh_minutes:15});
export function presentation(input={}){
 const count=Number(input.limit),refresh=Number(input.refresh_minutes);
 return {theme:Object.hasOwn(themes,input.theme)?input.theme:'classic',skin:Object.hasOwn(skins,input.skin)?input.skin:'none',layout:Object.hasOwn(layouts,input.layout)?input.layout:'list',limit:Number.isInteger(count)&&count>=1&&count<=12?count:12,refresh_minutes:refreshIntervals.includes(refresh)?refresh:15};
}
export function presentationFromURL(url,defaults={}){
 const input={...defaults};for(const key of Object.keys(defaultPresentation))if(url.searchParams.has(key))input[key]=url.searchParams.get(key);
 return presentation(input);
}
export function embedAddress(address,settings){
 const url=new URL(address);for(const [key,value] of Object.entries(presentation(settings)))url.searchParams.set(key,value);return url.href;
}
export function embedCode(address,settings){
 const options=presentation(settings),frame=document.createElement('iframe');frame.src=new URL(address).href;frame.title='Neuigkeiten aus unserem WhatsApp-Kanal';frame.width='100%';frame.height=options.skin==='ipad'?'760':options.skin==='none'?'640':'780';frame.loading='lazy';frame.referrerPolicy='no-referrer';frame.style.border='0';return frame.outerHTML;
}
