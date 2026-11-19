// Service Worker des HFS-Schaltungssimulators (ab V2.4): macht den Simulator offline nutzbar.
// Gehört auf den Webserver in denselben Ordner wie die Simulator-HTML-Datei, HFS-Simulator.webmanifest und HFS-Simulator-icon.png.
// Strategie: erst das Netz (immer die neueste Fassung), ohne Netz die zuletzt geladene Fassung aus dem Zwischenspeicher.
const CACHE = 'hfs-sim';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || !r.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || Response.error()))
  );
});
