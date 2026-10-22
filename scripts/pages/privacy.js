document.addEventListener('DOMContentLoaded', function () {
  fetch('../../components/header.html')
    .then(res => res.text())
    .then(html => {
      const hdr = document.getElementById('header-placeholder');
      if (!hdr) return;
      hdr.innerHTML = html;
      if (typeof window.initHeaderMenu === 'function') window.initHeaderMenu();
    })
    .catch(err => console.error(err));

  fetch('../../components/burger-dropdown.html')
    .then(res => res.text())
    .then(html => {
      const brDropdown = document.getElementById('burger-dropdown-placeholder');
      if (!brDropdown) return;
      brDropdown.innerHTML = html;
      if (typeof window.initBurgerDropdown === 'function') window.initBurgerDropdown();
    })
    .catch(err => console.error(err));

  fetch('../../components/footer.html')
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer-placeholder');
      if (!footer) return;
      footer.innerHTML = html;
      if (typeof window.applyTranslations === 'function') window.applyTranslations();
    })
    .catch(err => console.error(err));

  renderPrivacySections();
});

function renderPrivacySections() {
  const SUPPORTED_LANGS = ['en', 'ru', 'de', 'bg'];
const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
const defaultLang = SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'en';
const lang = localStorage.getItem('lang') || defaultLang;
  const t = window.translations && window.translations[lang];
  if (!t || !t.privacy) return;

  const container = document.getElementById('privacy-sections');
  if (!container) return;

  t.privacy.sections.forEach(section => {
    const point = document.createElement('div');
    point.className = 'privacy__content__point';

    const title = document.createElement('div');
    title.className = 'privacy__content__title';
    title.textContent = section.title;

    const desc = document.createElement('div');
    desc.className = 'privacy__content__description';
    desc.textContent = section.text;

    point.appendChild(title);
    point.appendChild(desc);
    container.appendChild(point);
  });
}
