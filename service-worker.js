self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("vocab-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        <script>
if ('serviceWorker' in navigator) {navigator.serviceWorker.register('service-worker.js');
}
</script>

        "./style.css",
        "./app.js"
      ]);
    })
  );
});
