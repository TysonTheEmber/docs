// Header view counter with per-session increment + number abbreviation
(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycby3Wz5nb-aiTRMjLQtAE81pv4cgtqo6GwcIpRzHXe1i/dev';   // e.g. https://script.google.com/macros/s/AKfycby3Wz5nb-aiTRMjLQtAE81pv4cgtqo6GwcIpRzHXe1i/dev
  const KEY = 'global';                        // single total for whole site

  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';
  const LAST_VAL_KEY = 'vc:last:value';        // stored across sessions
  const SESSION_HIT_KEY = 'vc:session:hit';    // resets when browser is closed

  // Format numbers as 1.2k, 3.4m, etc.
  function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "m";
    if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "k";
    return String(n);
  }

  function ensureHeaderCounter() {
    const inner = document.querySelector('.md-header .md-header__inner');
    if (!inner) return null;
    let wrap = document.getElementById(ID_WRAP);
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = ID_WRAP;
      wrap.className = 'pe-views pe-views--header';
      wrap.innerHTML = `<strong>Views:</strong> <span id="${ID_VALUE}">0</span>`;
      wrap.style.marginLeft = 'auto';
      inner.appendChild(wrap);
    }
    return wrap.querySelector('#' + ID_VALUE);
  }

  function setNumber(n) {
    const el = document.getElementById(ID_VALUE) || ensureHeaderCounter();
    if (el) el.textContent = formatNumber(n || 0);
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function init() {
    // Show last known value right away
    setNumber(parseInt(localStorage.getItem(LAST_VAL_KEY) || '0', 10));

    try {
      // Peek current value (no increment)
      const peek = await fetchJSON(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&peek=1`);
      if (typeof peek?.value === 'number') {
        setNumber(peek.value);
        localStorage.setItem(LAST_VAL_KEY, String(peek.value));
      }
    } catch { /* ignore peek failures */ }

    // Only increment if not already counted in this session
    if (!sessionStorage.getItem(SESSION_HIT_KEY)) {
      try {
        const hit = await fetchJSON(`${ENDPOINT}?key=${encodeURIComponent(KEY)}`); // increments
        if (typeof hit?.value === 'number') {
          setNumber(hit.value);
          localStorage.setItem(LAST_VAL_KEY, String(hit.value));
          sessionStorage.setItem(SESSION_HIT_KEY, '1');
        }
      } catch { /* ignore increment failures */ }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureHeaderCounter(); init(); });
  } else {
    ensureHeaderCounter(); init();
  }
})();
