function initGlobal() {
  const countries = [
    { name: 'GERMANY', src: '../../public/images/global/germany.png', symbol: 'de' },
    { name: 'FRANCE', src: '../../public/images/global/france.png', symbol: 'fr' },
    { name: 'POLAND', src: '../../public/images/global/poland.png', symbol: 'pl' },
    { name: 'AUSTRIA', src: '../../public/images/global/austria.png', symbol: 'au' },
    { name: 'LITHUANIA', src: '../../public/images/global/lithuania.png', symbol: 'lt' },
  ];

  const globalTranslations = {
    en:{
      country: {
        de: 'GERMANY',
        fr: 'France',
        pl: 'POLAND',
        au: 'AUSTRIA',
        lt: 'LITHUANIA',
      },

      trust: {
        titleOrd: 'TRUSTED BY \nCLIENTS IN OVER\n',
        titleBlue: '30 COUNTRIES',
      },
    },

    ru:{
      country: {
        de: 'ГЕРМАНИЯ',
        fr: 'ФРАНЦИЯ',
        pl: 'ПОЛЬША',
        au: 'АВСТРИЯ',
        lt: 'ЛИТВА',
      },
      trust: {
        titleOrd: 'ДОВЕРЯЮТ \nКЛИЕНТЫ В \nБОЛЕЕ ЧЕМ ',
        titleBlue: '30 СТРАНАХ',
      },
    },

    de: {
      country: {
        de: 'DEUTSCHLAND',
        fr: 'FRANKREICH',
        pl: 'POLEN',
        au: 'ÖSTERREICH',
        lt: 'LITAUEN',
      },
      trust: {
        titleOrd: 'VERTRAUEN IN \nKUNDEN AUS ÜBER',
        titleBlue: '30 LÄNDERN',
      },
    },

    bg: {
      country: {
        de: 'ГЕРМАНИЯ',
        fr: 'ФРАНЦИЯ',
        pl: 'ПОЛША',
        au: 'АВСТРИЯ',
        lt: 'ЛИТВА',
      },
      trust: {
        titleOrd: 'ДОВЕРИЕ ОТ \nКЛИЕНТИ В НАД',
        titleBlue: '30 ДЪРЖАВИ',
      },
    },
  }

  const SUPPORTED_LANGS = ['en', 'ru', 'de', 'bg'];
const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
const defaultLang = SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'en';
const lang = localStorage.getItem('lang') || defaultLang;
  const contentEl = document.querySelector('.content');

  countries.forEach(country => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('image-container');

    const img = document.createElement('img');
    img.src = country.src;
    img.alt = country.name;
    img.loaded = 'lazy';
    wrapper.appendChild(img);

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.textContent = globalTranslations[lang].country[country.symbol];
    overlay.dataset.i18n = 'global.country.' + country.symbol;
    wrapper.appendChild(overlay);

    contentEl.appendChild(wrapper);
  });

  const global = document.createElement('div');
  global.classList.add('image-container');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const overlayTitle = document.createElement('div');
  overlayTitle.classList.add('overlay__title');
  overlayTitle.innerHTML = globalTranslations[lang].trust.titleOrd.replace(/\n/g,'<br>');
  const overlaySpan = document.createElement('a');
  overlaySpan.classList.add('overlay__span');
  overlaySpan.textContent = `${globalTranslations[lang].trust.titleBlue} 🤝`;
  overlay.classList.add('overlay');
  overlay.append(overlayTitle, overlaySpan);
  global.appendChild(overlay);
  contentEl.appendChild(global);
}

window.initGlobal = initGlobal;