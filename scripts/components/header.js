// ;(function (global) {
//   const translations = global.translations || {};
//
//   function changeLanguage(lang) {
//     if (!translations[lang]) return;
//     location.hash = lang;
//     location.reload();
//   }
//
//   function applyTranslations(lang) {
//     const dict = translations[lang] || translations['en'];
//     document.querySelectorAll('[data-i18n]').forEach(el => {
//       const key = el.getAttribute('data-i18n');
//       if (key && dict[key]) el.textContent = dict[key];
//     });
//   }
//
//   function updateLangSwitcher(lang) {
//     const toggle = document.getElementById('lang-toggle');
//     const selected = document.querySelector(`.lang-item[data-lang="${lang}"]`);
//     if (!toggle || !selected) return;
//
//     toggle.querySelector('img.country').src = selected.querySelector('img').src;
//     toggle.querySelector('.lang-code').textContent = lang.toUpperCase();
//   }
//
//   function initHeaderMenu() {
//     const svcToggle = document.getElementById('services-toggle');
//     const svcMenu = document.getElementById('services-menu');
//     const svcArrow = document.getElementById('services-arrow');
//     svcToggle?.addEventListener('click', e => {
//       e.preventDefault();
//       svcMenu.classList.toggle('show');
//       svcArrow.classList.toggle('rotated');
//     });
//
//     const langToggle = document.getElementById('lang-toggle');
//     const langMenu = document.getElementById('lang-menu');
//     langToggle?.addEventListener('click', () => langMenu.classList.toggle('show'));
//
//     document.addEventListener('click', e => {
//       const t = e.target;
//       if (svcToggle && svcMenu && !svcToggle.contains(t) && !svcMenu.contains(t)) {
//         svcMenu.classList.remove('show');
//         svcArrow.classList.remove('rotated');
//       }
//       if (langToggle && langMenu && !langToggle.contains(t) && !langMenu.contains(t)) {
//         langMenu.classList.remove('show');
//       }
//     });
//
//     document.querySelectorAll('.lang-item').forEach(item =>
//       item.addEventListener('click', () => {
//         const code = item.getAttribute('data-lang');
//         code && changeLanguage(code);
//         localStorage.setItem('lang', code);
//       }),
//     );
//
//     const lang = window.location.hash.replace('#', '') || 'en';
//     applyTranslations(lang);
//     updateLangSwitcher(lang);
//   }
//
//   function copyToClipboard(textToCopy) {
//     if (navigator.clipboard?.writeText) {
//       return navigator.clipboard.writeText(textToCopy);
//     }
//   }
//
//   global.initHeaderMenu = initHeaderMenu;
//   global.copyToClipboard = copyToClipboard;
// })(window);


;(function (global) {
  const translations = global.translations || {};

  function getInitialLang() {
    const saved = localStorage.getItem('lang');
    const hash = window.location.hash.replace('#', '');

    if (saved && translations[saved]) return saved;
    if (hash && translations[hash]) return hash;
    return 'en';
  }

  function changeLanguage(lang) {
    if (!translations[lang]) return;
    localStorage.setItem('lang', lang);
    location.hash = lang;
    location.reload();
  }

  function applyTranslations(lang) {
    const dict = translations[lang] || translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key]) el.textContent = dict[key];
    });
  }

  function updateLangSwitcher(lang) {
    const toggle = document.getElementById('lang-toggle');
    const selected = document.querySelector(`.lang-item[data-lang="${lang}"]`);
    if (!toggle || !selected) return;

    const selImg = selected.querySelector('img');
    const tgtImg = toggle.querySelector('img.country');
    if (selImg && tgtImg) tgtImg.src = selImg.src;

    const codeEl = toggle.querySelector('.lang-code');
    if (codeEl) codeEl.textContent = lang.toUpperCase();
  }

  function initHeaderMenu() {
    const svcToggle = document.getElementById('services-toggle');
    const svcMenu = document.getElementById('services-menu');
    const svcArrow = document.getElementById('services-arrow');
    svcToggle?.addEventListener('click', e => {
      e.preventDefault();
      svcMenu?.classList.toggle('show');
      svcArrow?.classList.toggle('rotated');
    });

    const langToggle = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');
    langToggle?.addEventListener('click', () => langMenu?.classList.toggle('show'));

    document.addEventListener('click', e => {
      const t = e.target;
      if (svcToggle && svcMenu && !svcToggle.contains(t) && !svcMenu.contains(t)) {
        svcMenu.classList.remove('show');
        svcArrow?.classList.remove('rotated');
      }
      if (langToggle && langMenu && !langToggle.contains(t) && !langMenu.contains(t)) {
        langMenu.classList.remove('show');
      }
    });

    document.querySelectorAll('.lang-item').forEach(item =>
      item.addEventListener('click', () => {
        const code = item.getAttribute('data-lang');
        if (code) changeLanguage(code); // changeLanguage now persists to localStorage
      }),
    );

    const lang = getInitialLang();
    applyTranslations(lang);
    updateLangSwitcher(lang);
  }

  function copyToClipboard(textToCopy) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(textToCopy);
    }
  }

  global.initHeaderMenu = initHeaderMenu;
  global.copyToClipboard = copyToClipboard;
})(window);
