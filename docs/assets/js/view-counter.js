// Global views (everyone) shown in header, with per-session increment and periodic refresh.
// Uses Apps Script JSONP (/exec) so there's no CORS issue.
(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycby3Wz5nb-aiTRMjLQtAE81pv4cgtqo6GwcIpRzHXe1i/dev'; // <-- paste your Apps Script /exec URL
  const KEY = 'global';                     // or per-page: location.pathname.replace(/\/+$/,'') || 'home'
  const REFRESH_MS = 60 * 1000;             // pull fresh total every 60s so you see others' views
  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';

  // Abbreviate totals like 1.2k / 3.4m / 1.0b
  function fmt(n){
    if (n >= 1e9) return (Math.round(n/1e8)/10) + 'b';
    if (n >= 1e6) return (Math.round(n/1e5)/10) + 'm';
    if (n >= 1e3) return (Math.round(n/1e2)/10) + 'k';
    return String(n);
  }

  // JSONP helper to avoid CORS
  function jsonp(url){
    return new Promise((resolve, reject)=>{
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

  // Always show the live global total from the server
  async function peek() {
    try {
      const data = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&peek=1`);
      if (typeof data?.value === 'number') setNumber(data.value);
    } catch {
      // keep whatever is on screen; try again on next refresh
    }
  }

  // Optional: count once per *browser session* (not every reload)
  const SESSION_HIT_KEY = 'vc:session:hit';
  const LS_UUID = 'vc:uuid';
  function uuid() {
    let u = localStorage.getItem(LS_UUID);
    if (!u) {
      u = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c/4).toString(16)
      );
      localStorage.setItem(LS_UUID, u);
    }
    return u;
  }
  async function incrementOncePerSession() {
    if (sessionStorage.getItem(SESSION_HIT_KEY)) return; // already counted this session
    try {
      const u = uuid();
      const hit = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&uuid=${encodeURIComponent(u)}`);
      if (typeof hit?.value === 'number') {
        setNumber(hit.value);               // show new global total immediately
        sessionStorage.setItem(SESSION_HIT_KEY, '1');
      }
    } catch {
      // ignore; they will still see the global total via peek/pulls
    }
  }

  function start() {
    ensureHeaderCounter();
    // 1) Immediately fetch and display the **global** total everyone shares
    peek();
    // 2) Try to count this session once (server-side dedupe still applies)
    incrementOncePerSession();
    // 3) Keep refreshing the global total so other viewers’ visits show up
    setInterval(peek, REFRESH_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
