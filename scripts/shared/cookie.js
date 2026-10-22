function initCookie() {
  const cookieEl = document.querySelector('.cookie');
  const allowBtn = document.getElementById('allow-cookie');
  const denyBtn  = document.getElementById('deny-cookie');
  if (!cookieEl || !allowBtn || !denyBtn) return;

  const TTL_DAYS = 180;

  const hide = () => { cookieEl.style.display = 'none'; };

  const setConsent = (value) => {
    Cookies.set('cookie-consent', value, {
      expires: TTL_DAYS, path: '/', sameSite: 'Lax', secure: location.protocol === 'https:'
    });
    if (typeof window.setAnalyticsConsent === 'function') {
      window.setAnalyticsConsent(value === 'granted');
    }
    hide();
  };

  const consent = Cookies.get('cookie-consent');
  if (consent) { hide(); return; }
  setTimeout(() => { cookieEl.style.display = 'flex'; }, 1000);

  allowBtn.addEventListener('click', () => setConsent('granted'));
  denyBtn.addEventListener('click', () => setConsent('denied'));
}

// Inject the consent banner on any page that loads this script. Reuses an
// existing #cookie-placeholder if the page already has one (e.g. index.html).
function loadCookieBanner() {
  if (document.querySelector('.cookie')) { initCookie(); return; }

  let host = document.getElementById('cookie-placeholder');
  if (!host) {
    host = document.createElement('div');
    host.id = 'cookie-placeholder';
    document.body.appendChild(host);
  }

  fetch('../../components/cookie.html')
    .then(res => res.text())
    .then(html => {
      host.innerHTML = html;
      if (typeof window.applyTranslations === 'function') window.applyTranslations();
      initCookie();
    })
    .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', loadCookieBanner);
