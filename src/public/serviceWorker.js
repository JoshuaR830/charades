const charadesCache = "charades-v1"

const assets = [
    "/",
    "/images/charades-192.png",
    "/images/charades-512.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(charadesCache).then(cache => {
            cache.addAll(assets);
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})