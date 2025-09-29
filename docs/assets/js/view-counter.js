(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycby3Wz5nb-aiTRMjLQtAE81pv4cgtqo6GwcIpRzHXe1i/dev';
  const KEY = 'global';
  const REQUIRED_VISIBLE_MS = 30 * 1000;       // 30 seconds
  const WINDOW_MS = 24 * 60 * 60 * 1000;       // 24 hours

  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';
  const LS_LAST_VAL = 'vc:last:value';
  const LS_UUID     = 'vc:uuid';
  const LS_LAST_HIT = 'vc:last:hit';

  // abbreviate like 1.2k / 3.4m / 1.0b
  function fmt(n) {
    if (n >= 1e9) return (Math.round(n / 1e8) / 10) + 'b';
    if (n >= 1e6) return (Math.round(n / 1e5) / 10) + 'm';
    if (n >= 1e3) return (Math.round(n / 1e2) / 10) + 'k';
    return String(n);
  }

  function uuid() {
    let u = localStorage.getItem(LS_UUID);
    if (!u) {
      // RFC4122-ish random id (good enough)
      u = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
      localStorage.setItem(LS_UUID, u);
    }
    return u;
  }

  // JSONP loader
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
      wrap.innerHTML = `<strong>Views:</strong> <span id="${ID_VALUE}">0</span>`;
      wrap.style.marginLeft = 'auto';
      inner.appendChild(wrap);
    }
    return wrap.querySelector('#' + ID_VALUE);
  }

  function setNumber(n) {
    (document.getElementById(ID_VALUE) || ensureHeaderCounter()).textContent = fmt(Number(n || 0));
  }

  // fast paint from cache
  setNumber(parseInt(localStorage.getItem(LS_LAST_VAL) || '0', 10));

  // Only allow one increment per 24h (client-side guard; server enforces too)
  function canIncrementNow(now) {
    const last = parseInt(localStorage.getItem(LS_LAST_HIT) || '0', 10) || 0;
    return !last || (now - last) > WINDOW_MS;
  }

  // Track *visible* time (like YT's "watch for a while" heuristic)
  let visibleAccum = 0;
  let lastStamp = document.hidden ? 0 : performance.now();

  function onVisChange() {
    const now = performance.now();
    if (!document.hidden && lastStamp === 0) lastStamp = now;
    if (document.hidden && lastStamp !== 0) {
      visibleAccum += (now - lastStamp);
      lastStamp = 0;
    }
  }
  document.addEventListener('visibilitychange', onVisChange, { passive: true });

  // also treat interaction as signal (optional but helpful)
  let interacted = false;
  ['mousemove','scroll','keydown','click','touchstart'].forEach(ev =>
    window.addEventListener(ev, () => { interacted = true; }, { passive: true, once: true })
  );

  async function peek() {
    try {
      const data = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&peek=1`);
      if (typeof data?.value === 'number') {
        setNumber(data.value);
        localStorage.setItem(LS_LAST_VAL, String(data.value));
      }
    } catch {}
  }

  async function tryIncrement() {
    const now = Date.now();
    if (!canIncrementNow(now)) return;

    // finalize visible time if tab is currently visible
    if (!document.hidden && lastStamp) {
      visibleAccum += (performance.now() - lastStamp);
      lastStamp = performance.now(); // continue tracking
    }

    const enoughTime = visibleAccum >= REQUIRED_VISIBLE_MS;
    if (!enoughTime) return;               // require ≥30s visible
    if (!interacted && REQUIRED_VISIBLE_MS >= 30000) {
      // optional: require some interaction once; comment out if you don't want it
      // return;
    }

    try {
      const u = uuid();
      const data = await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&uuid=${encodeURIComponent(u)}`);
      if (typeof data?.value === 'number') {
        setNumber(data.value);
        localStorage.setItem(LS_LAST_VAL, String(data.value));
        localStorage.setItem(LS_LAST_HIT, String(now));
      }
    } catch {}
  }

  // Start: peek immediately, then periodically check if we can increment
  function start() {
    ensureHeaderCounter();
    peek();
    // check every 5s whether 30s visible has been met
    setInterval(tryIncrement, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
