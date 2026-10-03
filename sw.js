/* 御剑伏妖 · 离线缓存（安装后断网可玩） */
const CACHE = 'yujian-v1';
const CORE = [
  './', './index.html', './m.html', './manifest.json',
  './assets/icons/app-192.png', './assets/icons/app-512.png',
  './assets/icons/sk_charge.svg', './assets/icons/sk_web.svg', './assets/icons/sk_ring.svg',
  './assets/icons/sk_nova.svg', './assets/icons/sk_thunder.svg', './assets/icons/sk_split.svg',
  './assets/item/potion_bubbly.png', './assets/item/scroll_blue.png',
  './assets/bg2/b1.png', './assets/bg2/b2.png', './assets/bg2/b3.png', './assets/bg2/b4.png',
  './assets/bg2/b5.png', './assets/bg2/b6.png', './assets/bg2/b7.png', './assets/bg2/b8.png',
  './assets/bg2/b9.png', './assets/bg2/b10.png', './assets/bg2/b11.png', './assets/bg2/b12.png', './assets/bg2/b13.png',
  './assets/player/custom/g1.png', './assets/player/custom/g2.png', './assets/player/custom/g3.png',
  './assets/player/custom/g4.png', './assets/player/custom/g5.png', './assets/player/custom/g6.png',
  './assets/player/custom/g7.png', './assets/player/custom/g8.png',
  './assets/samples/koto_A3.mp3', './assets/samples/koto_D4.mp3', './assets/samples/koto_E4.mp3', './assets/samples/koto_G4.mp3',
  './assets/samples/flute_A4.mp3', './assets/samples/flute_D5.mp3', './assets/samples/flute_E5.mp3', './assets/samples/flute_G5.mp3',
  './assets/samples/violin_A3.mp3', './assets/samples/violin_C4.mp3', './assets/samples/violin_E4.mp3',
  './assets/samples/bells_C4.mp3', './assets/samples/bells_E4.mp3', './assets/samples/bells_G4.mp3',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('textdb.online')) return; // 排行榜走网络
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r.ok && url.origin === location.origin) {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
