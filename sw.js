const V='parcelio-v5';
const TILES='parcelio-tiles-run';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const PRE=['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'];
const EXT=['cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com','cdn.jsdelivr.net'];
const isTile=u=>(u.hostname==='www.ign.es'&&/wms/i.test(u.pathname))||u.hostname==='server.arcgisonline.com'||u.hostname==='tile.openstreetmap.org'||(u.hostname==='sigpac-hubcloud.es'&&/wms/i.test(u.pathname));
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL).then(()=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&!x.startsWith('parcelio-tiles')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function trim(c){const k=await c.keys();if(k.length>4000){for(const q of k.slice(0,k.length-3500))await c.delete(q)}}
self.addEventListener('fetch',e=>{
const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(u.origin===location.origin){
e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));return}
if(isTile(u)){
e.respondWith(caches.match(r,{ignoreVary:true}).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(TILES).then(async c=>{await c.put(r,cp);await trim(c)}).catch(()=>{})}return res}).catch(()=>Response.error())));return}
if(EXT.includes(u.hostname)){
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}return res})))}
});
