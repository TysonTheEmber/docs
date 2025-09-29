// Header view counter (per-session) using Apps Script JSONP (no CORS issues)
(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycby3Wz5nb-aiTRMjLQtAE81pv4cgtqo6GwcIpRzHXe1i/dev'; // <-- your /exec URL here
  const KEY = 'global'; // single total for whole site

  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';
  const LAST_VAL_KEY = 'vc:last:value';     // keep last known for fast paint (localStorage)
  const SESSION_HIT_KEY = 'vc:session:hit'; // per-session marker (sessionStorage)

  // Abbreviate 1.2k / 3.4m (one decimal when needed)
  function fmt(n) {
    if (n >= 1e9) return (Math.round((n / 1e9) * 10) / 10) + 'b';
    if (n >= 1e6) return (Math.round((n / 1e6) * 10) / 10) + 'm';
    if (n >= 1e3) return (Math.round((n / 1e3) * 10) / 10) + 'k';
    return String(n);
  }

  // Minimal JSONP loader
  function jsonp(url) {
    return new Promise((resolve, reject) => {
      const cb = 'vcb_' + Math.random().toString(36).slice(2);
      const cleanup = () => { delete window[cb]; script.remove(); };
      window[cb] = (data) => { resolve(data); cleanup(); };
      const script = document.createElement('script');
      script.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + cb;
      script.onerror = () => { reject(new Error('JSONP failed')); cleanup(); };
      document.head.appendChild(script);
    });
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
    if (el) el.textContent = fmt(Number(n || 0));
  }

  async function init() {
    // Fast paint
    setNumber(parseInt(localStorage.getItem(LAST_VAL_KEY) || '0', 10));

    // 1) Peek (no increment) to show up-to-date value
    try {
      const peek = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&peek=1`);
      if (typeof peek?.value === 'number') {
        setNumber(peek.value);
        localStorage.setItem(LAST_VAL_KEY, String(peek.value));
      }
    } catch { /* ignore */ }

    // 2) Increment only once per session
    if (!sessionStorage.getItem(SESSION_HIT_KEY)) {
      try {
        const hit = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}`);
        if (typeof hit?.value === 'number') {
          setNumber(hit.value);
          localStorage.setItem(LAST_VAL_KEY, String(hit.value));
          sessionStorage.setItem(SESSION_HIT_KEY, '1');
        }
      } catch { /* ignore */ }
    }v
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureHeaderCounter(); init(); });
  } else {
    ensureHeaderCounter(); init();
  }
})();
