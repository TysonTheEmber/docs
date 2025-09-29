// Global counter for all pages under /docs/
(function () {
  const NAMESPACE = 'tysontheember_docs';
  const KEY = 'global'; // single counter key for all pages
  const EL_ID = 'view-counter';

  function setNumber(n) {
    const el = document.getElementById(EL_ID);
    if (el) el.textContent = Number(n || 0).toLocaleString();
  }

  async function increment() {
    try {
      const r = await fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      if (typeof d?.value === 'number') setNumber(d.value);
      localStorage.setItem('vc:last', String(d.value));
    } catch {
      try {
        const r = await fetch(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`, { cache: 'no-store' });
        const d = await r.json();
        if (typeof d?.value === 'number') setNumber(d.value);
      } catch {/* ignore */}
    }
  }

  // Show last known count immediately (fast paint)
  const last = parseInt(localStorage.getItem('vc:last') || '0', 10);
  setNumber(last);

  // Increment on every load
  increment();
})();
