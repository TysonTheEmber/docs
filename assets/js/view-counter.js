(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycby3Wz5nb-aiTRMjLQtAE81pv4cgtqo6GwcIpRzHXe1i/dev';
  const KEY = 'global';                     // or per-page: (location.pathname.replace(/\/+$/,'')||'home').toLowerCase()
  const REFRESH_MS = 15000;                 // refresh global total every 15s
  const SESSION_HIT_KEY = 'vc:session:hit'; // sessionStorage flag (per tab/window)

  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';

  // k/m/b abbreviations
  function fmt(n) {
    if (n >= 1e9) return (Math.round(n/1e8)/10) + 'b';
    if (n >= 1e6) return (Math.round(n/1e5)/10) + 'm';
    if (n >= 1e3) return (Math.round(n/1e2)/10) + 'k';
    return String(n);
  }

  // JSONP loader (avoids CORS)
  function jsonp(url) {
    return new Promise((resolve, reject) => {
      const cb = 'vcb_' + Math.random().toString(36).slice(2);
      const s = document.createElement('script');
      const cleanup = () => { delete window[cb]; s.remove(); };
      window[cb] = (data) => { cleanup(); resolve(data); };
      s.onerror = () => { cleanup(); reject(new Error('JSONP failed')); };
      s.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + cb;
      document.head.appendChild(s);
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
      wrap.style.marginLeft = 'auto';
      wrap.innerHTML = `<strong>Views:</strong> <span id="${ID_VALUE}">…</span>`;
      inner.appendChild(wrap);
    }
    return wrap.querySelector('#' + ID_VALUE);
  }

  function setNumber(n) {
    const el = document.getElementById(ID_VALUE) || ensureHeaderCounter();
    if (el) el.textContent = fmt(Number(n || 0));
  }

  async function peek() {
    try {
      const data = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&peek=1`);
      if (typeof data?.value === 'number') setNumber(data.value);
    } catch {}
  }

  async function incrementOncePerSession() {
    if (sessionStorage.getItem(SESSION_HIT_KEY)) return; // already counted this session
    try {
      const hit = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}`); // increments
      if (typeof hit?.value === 'number') setNumber(hit.value);
      sessionStorage.setItem(SESSION_HIT_KEY, '1');
    } catch {}
  }

  function start() {
    ensureHeaderCounter();
    // 1) Show the current global total immediately
    peek();
    // 2) Increment one time for this tab/window session
    incrementOncePerSession();
    // 3) Keep refreshing so others’ new views appear on this screen
    setInterval(peek, REFRESH_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
