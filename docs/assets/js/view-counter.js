// View counter that updates every minute using CountAPI
(function () {
  const NAMESPACE = 'tysontheember_docs';
  const KEY = 'home';
  const EL_ID = 'view-counter';
  const INTERVAL_MS = 60 * 1000; // 1 minute

  function setNumber(n) {
    const el = document.getElementById(EL_ID);
    if (el) el.textContent = n.toLocaleString();
  }

  function hit() {
    fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`)
      .then(r => r.json())
      .then(d => {
        if (d && typeof d.value === 'number') setNumber(d.value);
      })
      .catch(() => {});
  }

  // initial value (get current count but don't increment yet)
  fetch(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`)
    .then(r => r.json())
    .then(d => setNumber((d && typeof d.value === 'number') ? d.value : 0))
    .catch(() => {});

  // first increment immediately, then every minute
  hit();
  setInterval(hit, INTERVAL_MS);
})();
