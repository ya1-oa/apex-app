/* WITHERS migration: retire Apex cache-first service worker. */
const VERSION='withers-root-v6';
self.addEventListener('install',e=>{e.waitUntil(self.skipWaiting())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin)return;
 e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request)));
});
