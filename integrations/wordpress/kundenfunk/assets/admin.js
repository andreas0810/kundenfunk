(()=>{
 const root=document.querySelector('.kf-admin'),preview=root?.querySelector('#kf-preview .kf-embed');if(!root||!preview)return;
 const read=key=>root.querySelector('[data-kf-option="'+key+'"]')?.value;
 function update(){const account=JSON.parse(root.querySelector('#kf-preview').dataset.account||'{}');const settings=read('source')==='account'?account:{theme:read('theme'),skin:read('skin'),layout:read('layout'),limit:read('limit')};preview.className='kf-embed kf-theme-'+settings.theme+' kf-skin-'+settings.skin+' kf-layout-'+settings.layout;preview.querySelectorAll('article').forEach((post,index)=>post.hidden=index>=Number(settings.limit||12));}
 root.querySelectorAll('[data-kf-option]').forEach(input=>input.addEventListener('change',update));update();
})();
