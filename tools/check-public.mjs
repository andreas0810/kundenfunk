// Dependency-free checks of the exported repository. No network or credentials.
import assert from 'node:assert/strict';
import {readFileSync,existsSync,lstatSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFileSync(resolve(root,name),'utf8');
const releases=JSON.parse(read('web/releases.json'));
const manifest=JSON.parse(read('PUBLIC-MANIFEST.json'));
const compatibility=JSON.parse(read('web/compatibility.json'));
assert.equal(manifest.version,releases.current,'Manifest/product version');
const plugin=read('integrations/wordpress/kundenfunk/kundenfunk.php');
const readme=read('integrations/wordpress/kundenfunk/readme.txt');
assert.equal(plugin.match(/\* Version:\s*([\d.]+)/)?.[1],releases.wordpress,'Plugin header');
assert.equal(plugin.match(/define\(\s*'KF_VERSION',\s*'([\d.]+)'/)?.[1],releases.wordpress,'Asset version');
assert.equal(readme.match(/^Stable tag: (.+)$/m)?.[1],releases.wordpress,'Stable tag');
assert.equal(readme.match(/^Tested up to: (.+)$/m)?.[1],compatibility.wordpress_tested.split('.').slice(0,2).join('.'),'Tested version');
assert(existsSync(resolve(root,'integrations/wordpress/kundenfunk/LICENSE.txt')));
assert.equal(new Set(releases.versions.map(item=>item.version)).size,releases.versions.length,'Unique releases');
for(const release of releases.versions)assert(Number.isFinite(Date.parse(release.date)),'Release date');

execFileSync(process.execPath,['web/generate-site.mjs'],{cwd:root,stdio:'inherit'});
for(const [name,expected] of Object.entries(manifest.files)){
 assert(!name.startsWith('/')&&!name.split('/').includes('..'),'Safe manifest path');
 const path=resolve(root,name);assert(lstatSync(path).isFile(),'Regular file: '+name);
 assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),expected,'Changed file: '+name+'; regenerate the reviewed product export');
 if(/\.(mjs|js)$/.test(name))execFileSync(process.execPath,['--check',name],{cwd:root});
}
const pages=['','preise','wordpress','entwickler','versionen','kompatibilitaet','betreiber','install'];
const archives=new Set(releases.versions.flatMap(item=>['/downloads/kundenfunk-wordpress-'+item.wordpress+'.zip','/downloads/kundenfunk-embed-'+item.embed+'.zip']));
for(const page of pages){
 const path='web/'+(page?page+'/':'')+'index.html',html=read(path);
 assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1,'One main heading: '+path);
 assert(html.includes('name="description"'),'Description: '+path);
 if(page!=='install')assert(html.includes('rel="canonical" href="https://kundenfunk.pages.dev/'+(page?page+'/':'')+'"'),'Canonical: '+path);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(ids).size,ids.length,'Unique IDs: '+path);
 for(const match of html.matchAll(/href="([^"]+)"/g)){
  const address=new URL(match[1].replaceAll('&amp;','&'),'https://kundenfunk.pages.dev/'+(page?page+'/':''));
  if(address.origin!=='https://kundenfunk.pages.dev')continue;
  if(address.pathname==='/admin/'||address.pathname==='/downloads/SHA256SUMS.txt')continue;
  if(address.pathname.startsWith('/downloads/')){assert(archives.has(address.pathname),'Known package: '+address.pathname);continue;}
  const target='web'+address.pathname+(address.pathname.endsWith('/')?'index.html':'');
  assert(existsSync(resolve(root,target)),'Internal link: '+address.pathname);
  if(address.hash){const source=read(target);assert(source.includes('id="'+decodeURIComponent(address.hash.slice(1))+'"'),'Anchor: '+address.href);}
 }
}
console.log('Public checks passed: manifest, reproducible pages, JavaScript syntax, component versions, licenses, internal links and anchors.');
