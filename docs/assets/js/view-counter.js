// Per-session immediate increment (JSONP) + k/m abbreviations
(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycby3Wz5nb-aiTRMjLQtAE81pv4cgtqo6GwcIpRzHXe1i/dev'; // <-- /exec URL
  const KEY = 'global';

  const ID_WRAP = 'pe-views-header';
  const ID_VALUE = 'view-counter';
  const LS_LAST_VAL = 'vc:last:value';
  const SS_HIT = 'vc:session:hit';
  const LS_UUID = 'vc:uuid';

  function fmt(n){ if(n>=1e9)return(Math.round(n/1e8)/10)+'b';
                   if(n>=1e6)return(Math.round(n/1e5)/10)+'m';
                   if(n>=1e3)return(Math.round(n/1e2)/10)+'k';
                   return String(n); }

  function ensureHeaderCounter(){
    const inner=document.querySelector('.md-header .md-header__inner');
    if(!inner) return null;
    let wrap=document.getElementById(ID_WRAP);
    if(!wrap){
      wrap=document.createElement('div');
      wrap.id=ID_WRAP;
      wrap.className='pe-views pe-views--header';
      wrap.style.marginLeft='auto';
      wrap.innerHTML='<strong>Views:</strong> <span id="'+ID_VALUE+'">0</span>';
      inner.appendChild(wrap);
    }
    return wrap.querySelector('#'+ID_VALUE);
  }
  function setNumber(n){
    (document.getElementById(ID_VALUE)||ensureHeaderCounter()).textContent=fmt(Number(n||0));
  }
  function uuid(){
    let u=localStorage.getItem(LS_UUID);
    if(!u){
      u=([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
      localStorage.setItem(LS_UUID,u);
    }
    return u;
  }
  function jsonp(url){
    return new Promise((resolve,reject)=>{
      const cb='vcb_'+Math.random().toString(36).slice(2);
      const s=document.createElement('script');
      const cleanup=()=>{ delete window[cb]; s.remove(); };
      window[cb]=(data)=>{ cleanup(); resolve(data); };
      s.onerror=()=>{ cleanup(); reject(new Error('JSONP failed')); };
      s.src=url+(url.includes('?')?'&':'?')+'callback='+cb;
      document.head.appendChild(s);
    });
  }

  // Fast paint
  setNumber(parseInt(localStorage.getItem(LS_LAST_VAL)||'0',10));

  async function init(){
    ensureHeaderCounter();

    // 1) Always peek to show latest immediately
    try{
      const data=await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&peek=1`);
      if(typeof data?.value==='number'){
        setNumber(data.value);
        localStorage.setItem(LS_LAST_VAL,String(data.value));
      }
    }catch{}

    // 2) Increment once per session
    if(!sessionStorage.getItem(SS_HIT)){
      try{
        const u=uuid();
        const hit=await jsonp(`${ENDPOINT}?key=${encodeURIComponent(KEY)}&uuid=${encodeURIComponent(u)}`);
        if(typeof hit?.value==='number'){
          setNumber(hit.value);
          localStorage.setItem(LS_LAST_VAL,String(hit.value));
          sessionStorage.setItem(SS_HIT,'1');
        }
      }catch{}
    }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); } else { init(); }
})();
