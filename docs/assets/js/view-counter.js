// Global counter shown in the Material header (no Jinja overrides)
(function () {
  const NAMESPACE = 'tysontheember_docs';
  const KEY = 'global'; // one shared counter
  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';

  function ensureHeaderCounter() {
    // Material header container
    const inner = document.querySelector('.md-header .md-header__inner');
    if (!inner) return null;

    // Reuse if already present
    let wrap = document.getElementById(ID_WRAP);
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = ID_WRAP;
      wrap.className = 'pe-views pe-views--header';
      wrap.innerHTML = '<strong>Views:</strong> <span id="' + ID_VALUE + '">0</span>';
      // push to the right side of the header row
      wrap.style.marginLeft = 'auto';
      inner.appendChild(wrap);
    }
    return wrap.querySelector('#' + ID_VALUE);
  }

  function setNumber(n) {
    const el = document.getElementById(ID_VALUE) || ensureHeaderCounter();
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
      } catch {}
    }
  }

  // Fast paint with last known value
  setNumber(parseInt(localStorage.getItem('vc:last') || '0', 10));

  // Ensure node exists, then increment
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureHeaderCounter(); increment(); });
  } else {
    ensureHeaderCounter(); increment();
  }
})();
