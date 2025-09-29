// Global header counter using simplecount API (no login required)
(function () {
  const ENDPOINT = 'https://api.simplecounterapi.com/count';
  const SITE_KEY = 'tysontheember-docs'; // choose a unique key name

  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';

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
    if (el) el.textContent = Number(n || 0).toLocaleString();
  }

  async function hit() {
    try {
      // Increment & get current total
      const res = await fetch(`${ENDPOINT}?key=${SITE_KEY}`, { method: 'POST' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (typeof data?.count === 'number') {
        setNumber(data.count);
        localStorage.setItem('vc:last', String(data.count));
      }
    } catch (e) {
      // fallback: show cached number
      const last = localStorage.getItem('vc:last');
      if (last) setNumber(parseInt(last, 10));
    }
  }

  // Show last known value immediately
  setNumber(parseInt(localStorage.getItem('vc:last') || '0', 10));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureHeaderCounter(); hit(); });
  } else {
    ensureHeaderCounter(); hit();
  }
})();
