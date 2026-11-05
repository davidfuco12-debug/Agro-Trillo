const V='agro-tillo-v3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const EXT=['cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(u.origin===location.origin){
e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));return}
if(EXT.includes(u.hostname)){
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}return res})))}
});
