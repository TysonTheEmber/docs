// Robust view counter (CountAPI) with retry/backoff + tab-visibility handling
(function () {
  const NAMESPACE = 'tysontheember_docs';
  // Per-page key (comment this line and uncomment the next to make it global "home")
  const KEY = (location.pathname.replace(/\/+$/, '') || '/').toLowerCase();
  // const KEY = 'home';

  const EL_ID = 'view-counter';
  const ONE_MIN = 60 * 1000;

  // Keep last value across reloads
  const storageKey = `vc:last:${KEY}`;
  let value = parseInt(localStorage.getItem(storageKey) || '0', 10) || 0;
  let timer = null;
  let backoffMs = ONE_MIN;          // start at 1 min
  const MAX_BACKOFF = 10 * ONE_MIN; // cap at 10 min

  function setNumber(n) {
    value = n;
    localStorage.setItem(storageKey, String(n));
    const el = document.getElementById(EL_ID);
    if (el) el.textContent = n.toLocaleString();
  }

  // Initialize UI with last known value (so we never show — again)
  (function initDisplay() {
    const el = document.getElementById(EL_ID);
    if (el) el.textContent = value ? value.toLocaleString() : '0';
  })();

  async function fetchJSON(url, opts = {}) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000); // 8s timeout
    try {
      const res = await fetch(url, { signal: ctl.signal, cache: 'no-store', ...opts });
      // Handle 429 rate limit with Retry-After if provided
      if (res.status === 429) {
        const ra = parseInt(res.headers.get('Retry-After') || '0', 10);
        throw Object.assign(new Error('Rate limited'), { rateLimited: true, retryAfter: ra });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(t);
    }
  }

  async function getOnce() {
    try {
      const d = await fetchJSON(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`);
      if (d && typeof d.value === 'number') setNumber(d.value);
      backoffMs = ONE_MIN; // reset backoff on success
    } catch (e) {
      // keep current display; schedule retry with backoff
      scheduleNext(e && e.rateLimited ? (Math.min((e.retryAfter || 60) * 1000, MAX_BACKOFF)) : Math.min(backoffMs *= 1.8, MAX_BACKOFF));
    }
  }

  async function hitOnce() {
    try {
      const d = await fetchJSON(`https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`);
      if (d && typeof d.value === 'number') setNumber(d.value);
      scheduleNext(ONE_MIN); // next tick in 1 min on success
      backoffMs = ONE_MIN;
    } catch (e) {
      // On failure, don’t lose the number — just retry later
      const wait = e && e.rateLimited
        ? Math.min((e.retryAfter || 60) * 1000, MAX_BACKOFF)
        : Math.min(backoffMs *= 1.8, MAX_BACKOFF);
      scheduleNext(wait);
    }
  }

  function scheduleNext(ms) {
    if (timer) clearTimeout(timer);
    // If tab is hidden, delay until visible to avoid throttled timers
    if (document.hidden) {
      timer = setTimeout(() => {
        if (!document.hidden) hitOnce();
        else scheduleNext(ms); // keep nudging until visible
      }, Math.max(ms, 15 * 1000));
    } else {
      timer = setTimeout(hitOnce, ms);
    }
  }

  // Start: sync current value (without increment), then increment loop
  getOnce().finally(() => hitOnce());

  // Resume immediately when tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // force a quick refresh on focus
      if (timer) clearTimeout(timer);
      hitOnce();
    }
  });
})();
