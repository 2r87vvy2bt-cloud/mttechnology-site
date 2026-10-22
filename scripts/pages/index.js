function getActiveLang() {
  const supported = ['en', 'ru', 'de', 'bg'];
  const saved = localStorage.getItem('lang');
  if (saved && supported.includes(saved)) return saved;
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return supported.includes(browser) ? browser : 'en';
}

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

  fetch('../../components/introduction.html')
    .then(res => res.text())
    .then(html => {
      const intro = document.getElementById('introduction-placeholder');
      if (!intro) return;
      intro.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initIntroduction === 'function') window.initIntroduction();
    })
    .catch(err => console.error(err));

  fetch('../../components/metal-price.html')
    .then(res => res.text())
    .then(html => {
      const metal = document.getElementById('metal-price-placeholder');
      if (!metal) return;
      metal.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initNonFerrous === 'function') window.initNonFerrous();
      if (typeof window.initFerroalloy === 'function') window.initFerroalloy();
      if (typeof window.initPrecious === 'function') window.initPrecious();
    })
    .catch(err => console.error(err));

  fetch('../../components/personal-consultations.html')
    .then(res => res.text())
    .then(html => {
      const consult = document.getElementById('personal-consultation-placeholder');
      if (!consult) return;
      consult.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
    })
    .catch(err => console.error(err));

  fetch('../../components/catalog.html')
    .then(res => res.text())
    .then(html => {
      const catalog = document.getElementById('catalog-metals-placeholder');
      if (!catalog) return;
      catalog.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initMetalsCatalog === 'function') window.initMetalsCatalog();

    })
    .catch(err => console.error(err));

  fetch('../../components/catalog.html')
    .then(res => res.text())
    .then(html => {
      const catalog = document.getElementById('catalog-services-placeholder');
      if (!catalog) return;
      catalog.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initServicesCatalog === 'function') window.initServicesCatalog();

    })
    .catch(err => console.error(err));


  fetch('../../components/global.html')
    .then(res => res.text())
    .then(html => {
      const global = document.getElementById('global-placeholder');
      if (!global) return;
      global.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initGlobal === 'function') window.initGlobal();

    })
    .catch(err => console.error(err));

  fetch('../../components/blog-section.html')
    .then(res => res.text())
    .then(html => {
      const blog = document.getElementById('blog-placeholder');
      if (!blog) return;
      blog.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initBlogSection === 'function') window.initBlogSection();

    })
    .catch(err => console.error(err));

  fetch('../../components/global.html')
    .then(res => res.text())
    .then(html => {
      const global = document.getElementById('global-placeholder');
      if (!global) return;
      global.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initGlobal === 'function') window.initGlobal();

    })
    .catch(err => console.error(err));

  fetch('../../components/projects.html')
    .then(res => res.text())
    .then(html => {
      const projects = document.getElementById('projects-placeholder');
      if (!projects) return;
      projects.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initProjects === 'function') window.initProjects();

    })
    .catch(err => console.error(err));

  fetch('../../components/FAQ.html')
    .then(res => res.text())
    .then(html => {
      const faq = document.getElementById('FAQ-placeholder');
      if (!faq) return;
      faq.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initFAQ === 'function') window.initFAQ();

    })
    .catch(err => console.error(err));

  fetch('../../components/tech.html')
    .then(res => res.text())
    .then(html => {
      const tech = document.getElementById('tech-placeholder');
      if (!tech) return;
      tech.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
      if (typeof window.initTech === 'function') window.initTech();
      if (typeof window.initLeafletMap === 'function') window.initLeafletMap();
    })
    .catch(err => console.error(err));

  fetch('../../components/footer.html')
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer-placeholder');
      if (!footer) return;
      footer.innerHTML = html;
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);

    })
    .catch(err => console.error(err));

  setTimeout(checkDestination, 50);

  function checkDestination() {
    const dest = localStorage.getItem('dest');
    if (!dest) return;

    const place = document.querySelector('.' + dest);
    console.log(place);
    if (place) {
      place.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      localStorage.removeItem('dest');
    } else {
      console.warn('Could not find element for dest=', dest);
    }
  }
});

function getCurrentLanguage() {
  return getActiveLang();
}