// CountAPI "hit-every-load" view counter
(function () {
  // Use per-page key so each page has its own counter.
  // If you want ONLY the homepage, change KEY to 'home'.
  const NAMESPACE = 'tysontheember_docs';
  const KEY = (location.pathname.replace(/\/+$/, '') || '/').toLowerCase();

  const EL_ID = 'view-counter';
  const el = document.getElementById(EL_ID);

  function setNumber(n) {
    if (el) el.textContent = Number(n || 0).toLocaleString();
  }

  // 1) Show current value (no increment) so we render *something* immediately
  fetch(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`, { cache: 'no-store' })
    .then(r => r.ok ? r.json() : { value: 0 })
    .then(d => setNumber(d.value))
    .catch(() => { /* keep whatever is in the span */ });

  // 2) Record the hit for THIS load
  fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`, { cache: 'no-store' })
    .then(r => r.ok ? r.json() : null)
    .then(d => d && typeof d.value === 'number' && setNumber(d.value))
    .catch(() => { /* ignore; user still sees last known number */ });
})();
