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
      const _supported = ['en', 'ru', 'de', 'bg'];
      const _browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
      const lang = localStorage.getItem('lang') || (_supported.includes(_browser) ? _browser : 'en');
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
    })
    .catch(err => console.error(err));

  window.initServices();
});

const translations = {
  en: {
    buttons: {
      buyBtn: 'Buy Products',
      sellBtn: 'Sell Products',
      orderBtn: 'Order Service',
    },
    services: {
      HT: {
        title: 'HYDROMETALLURGICAL TECHNOLOGIES',
        description: 'Projects for the extraction of metals from ores and slags using gentle chemical methods, minimizing energy costs and waste volumes',
      },
      MR: {
        title: 'METALLURGICAL PROCESS',
        description: 'Optimization of smelting furnaces, eoxidation and vacuum degassing, increasing the yield of target products',
      },
      EE: {
        title: 'ELECTROCHEMICAL EXTRACTION',
        description: 'Electrolysis and electrochemical extraction for obtaining pure metals (Ni, Co, Cu) and alloys',
      },
      GE: {
        title: 'GRAVITY ENRICHMENT',
        description: 'Vibrating rack systems, spiral and sluice type concentrators for density separation',
      },
      WT: {
        title: 'WASTEWATER TREATMENT',
        description: 'Integrated solutions for metallurgy and chemical industry enterprises: from removal of suspended particles to fine precipitation of heavy metals',
      },
      EC: {
        title: 'ENVIRONMENTAL CONSULTING',
        description: 'Full cycle: technical audit, development of design documentation, construction supervision and commissioning',
      },
      LG: {
        title: 'CARGO LOGISTICS',
        description: 'We assist with delivery of raw materials and finished products: freight forwarding, customs clearance, and reliable door-to-door shipping.',
      },
    },
  },
  ru: {
    buttons: {
      buyBtn: 'Купить продукты',
      sellBtn: 'Продать продукты',
      orderBtn: 'Заказать услугу',
    },
    services: {
      HT: {
        title: 'ГИДРОМЕТАЛЛУРГИЧЕСКИЕ ТЕХНОЛОГИИ',
        description: 'Проекты по извлечению металлов из руд и шлаков щадящими химическими методами с минимизацией энергозатрат и объёмов отходов',
      },
      MR: {
        title: 'МЕТАЛЛУРГИЧЕСКИЙ ПРОЦЕСС',
        description: 'Оптимизация плавильных печей, деоксидирование и вакуумная дегазация, увеличение выхода целевой продукции',
      },
      EE: {
        title: 'ЭЛЕКТРОХИМИЧЕСКОЕ ВЫДЕЛЕНИЕ',
        description: 'Электролиз и электрохимическое извлечение для получения чистых металлов (Ni, Co, Cu) и сплавов',
      },
      GE: {
        title: 'ГРАВИТАЦИОННОЕ ОБОГАЩЕНИЕ',
        description: 'Вибрационные рамные, спиральные и шлюзовые концентраторы для разделения по плотности',
      },
      WT: {
        title: 'ОЧИСТКА СТОЧНЫХ ВОД',
        description: 'Комплексные решения для металлургии и химической промышленности: от удаления взвешенных частиц до тонкого осаждения тяжёлых металлов',
      },
      EC: {
        title: 'ЭКОЛОГИЧЕСКИЕ КОНСУЛЬТАЦИИ',
        description: 'Полный цикл: технический аудит, разработка проектной документации, авторский надзор и ввод в эксплуатацию',
      },
      LG: {
        title: 'ГРУЗОВАЯ ЛОГИСТИКА',
        description: 'Помогаем с доставкой сырья и готовой продукции: экспедирование грузов, таможенное оформление и надёжная доставка от двери до двери.',
      },
    },
  },
  de: {
    buttons: {
      buyBtn: 'Produkte kaufen',
      sellBtn: 'Produkte verkaufen',
      orderBtn: 'Dienstleistung bestellen',
    },
    services: {
      HT: {
        title: 'HYDROMETALLURGISCHE TECHNOLOGIEN',
        description: 'Projekte zur Extraktion von Metallen aus Erzen und Schlacken unter Verwendung schonender chemischer Methoden, Minimierung von Energiekosten und Abfallmengen',
      },
      MR: {
        title: 'METALLURGISCHER PROZESS',
        description: 'Optimierung von Schmelzöfen, Deoxidation und Vakuum-Entgasung, Erhöhung des Ausstoßes von Zielprodukten',
      },
      EE: {
        title: 'ELEKTROCHEMISCHE EXTRAKTION',
        description: 'Elektrolyse und elektrochemische Extraktion zur Gewinnung reiner Metalle (Ni, Co, Cu) und Legierungen',
      },
      GE: {
        title: 'GRAVITATIONSANREICHERUNG',
        description: 'Vibrationssysteme, Spiral- und Rinnenkonzentratoren zur Dichte-Trennung',
      },
      WT: {
        title: 'ABWASSERBEHANDLUNG',
        description: 'Integrierte Lösungen für die Metallurgie und chemische Industrie: von der Entfernung suspendierter Partikel bis hin zur feinen Niederschlagung von Schwermetallen',
      },
      EC: {
        title: 'UMWELTBERATUNG',
        description: 'Vollständiger Zyklus: technische Prüfung, Entwicklung von Planungsdokumentationen, Baubegleitung und Inbetriebnahme',
      },
      LG: {
        title: 'FRACHTLOGISTIK',
        description: 'Wir unterstützen bei der Lieferung von Rohstoffen und Produkten: Frachtspedition, Zollabfertigung und zuverlässige Tür-zu-Tür-Lieferung.',
      },
    },
  },

  bg: {
    buttons: {
      buyBtn: 'Купи продукти',
      sellBtn: 'Продай продукти',
      orderBtn: 'Поръчай услуга',
    },
    services: {
      HT: {
        title: 'ХИДРОМЕТАЛУРГИЧНИ ТЕХНОЛОГИИ',
        description: 'Проекти за извличане на метали от руди и шлаки чрез щадящи химични методи с минимизиране на енергийните разходи и обемите отпадъци',
      },
      MR: {
        title: 'МЕТАЛУРГИЧЕН ПРОЦЕС',
        description: 'Оптимизация на топилни пещи, разкисляване и вакуумна дегазация, повишаване на добива на целеви продукти',
      },
      EE: {
        title: 'ЕЛЕКТРОХИМИЧНО ИЗВЛИЧАНЕ',
        description: 'Електролиза и електрохимично извличане за получаване на чисти метали (Ni, Co, Cu) и сплави',
      },
      GE: {
        title: 'ГРАВИТАЦИОННО ОБОГАТЯВАНЕ',
        description: 'Вибрационни маси, спирални и шлюзови концентратори за разделяне по плътност',
      },
      WT: {
        title: 'ПРЕЧИСТВАНЕ НА ОТПАДЪЧНИ ВОДИ',
        description: 'Комплексни решения за металургични и химически предприятия: от отстраняване на суспендирани частици до фино утаяване на тежки метали',
      },
      EC: {
        title: 'ЕКОЛОГИЧНО КОНСУЛТИРАНЕ',
        description: 'Пълен цикъл: технически одит, разработване на проектна документация, строителен надзор и въвеждане в експлоатация',
      },
      LG: {
        title: 'ТОВАРНА ЛОГИСТИКА',
        description: 'Съдействаме за доставка на суровини и готова продукция: спедиция, митническо оформяне и надеждна доставка от врата до врата.',
      },
    },
  },
};

function initServices() {
  const _supported = ['en', 'ru', 'de', 'bg'];
  const _browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const lang = localStorage.getItem('lang') || (_supported.includes(_browser) ? _browser : 'en');
  const items = [
    { image: '../../public/images/catalog/services/hydro.jpg', title: translations[lang].services.HT.title, tags: [], description: translations[lang].services.HT.description, type: 'Order Service', index: 'HT' },
    { image: '../../public/images/catalog/services/met-process.jpg', title: translations[lang].services.MR.title, tags: [], description: translations[lang].services.MR.description, type: 'Order Service', index: 'MR' },
    { image: '../../public/images/catalog/services/electro-ext.jpg', title: translations[lang].services.EE.title, tags: ['Ni', 'Co', 'Cu'], description: translations[lang].services.EE.description, type: 'Order Service', index: 'EE' },
    { image: '../../public/images/catalog/services/gravity.jpg', title: translations[lang].services.GE.title, tags: [], description: translations[lang].services.GE.description, type: 'Order Service', index: 'GE' },
    { image: '../../public/images/catalog/services/waste.jpg', title: translations[lang].services.WT.title, tags: [], description: translations[lang].services.WT.description, type: 'Order Service', index: 'WT' },
    { image: '../../public/images/catalog/services/env.jpg', title: translations[lang].services.EC.title, tags: [], description: translations[lang].services.EC.description, type: 'Order Service', index: 'EC' },
    { image: '../../public/images/catalog/services/logistics.jpg', title: translations[lang].services.LG.title, tags: [], description: translations[lang].services.LG.description, type: 'Order Service', index: 'LG' },
  ];

  const grid = document.querySelector('.service__content');
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-button');

  function renderItem(item) {
    const card = document.createElement('div');
    card.className = 'catalog__card';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    img.loading = 'lazy';
    img.className = 'catalog__image';

    const body = document.createElement('div');
    body.className = 'catalog__body';

    const title = document.createElement('span');
    title.className = 'catalog__item-title';
    title.textContent = item.title;

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'catalog__tags';
    item.tags.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tagsContainer.appendChild(tag);
    });

    const desc = document.createElement('p');
    desc.className = 'catalog__description';
    desc.textContent = item.description;

    const btn = document.createElement('a');
    btn.className = 'button-long-white catalog__action';
    btn.href = 'placing-order.html';
    btn.textContent = translations[lang].buttons.orderBtn;
    btn.dataset.i18n = 'buttons.orderBtn';

    btn.addEventListener('click', () => {
      localStorage.setItem('order-key', item.index);
    });

    body.append(title, tagsContainer, desc);
    card.append(img, body, btn);
    grid.appendChild(card);
  }

  items.forEach(renderItem);

  searchBtn.addEventListener('click', e => {
    const q = searchInput.value.trim().toLowerCase();
    grid.innerHTML = '';

    const filtered = q === ''
      ? items
      : items.filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some(tag => tag.toLowerCase().includes(q))
        );
      });

    filtered.forEach(renderItem);
  });
}

window.initServices = initServices;
