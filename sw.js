// 星屑もぐ：オフラインでも開けるようにするキャッシュ
const CACHE = 'mogu-20261104004500';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './img/hero.webp', './img/chibi.webp', './img/tanu.webp', './img/tanu-omekashi.webp', './img/tanu-nirami.webp', './img/tanu-hasamari.webp', './img/tanu-puri.webp', './img/tanu-almond.webp', './img/tanu-pa.webp', './img/tanu-hyoro.webp', './img/tanu-maru.webp', './img/tanu-uzumari.webp', './img/tanu-ne.webp', './img/tanu-minaizo.webp', './img/tanu-mi.webp', './img/tanu-tokai.webp', './img/tanu-kagero.webp', './img/tanu-hanachochin.webp', './img/wing-glow.webp', './img/wing-glow-l.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// ページは最新を優先し、電波がないときだけキャッシュを使う（version.json と管理画面はキャッシュしない）
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('version.json') || url.pathname.includes('/admin/')) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
