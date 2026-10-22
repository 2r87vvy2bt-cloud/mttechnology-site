import {catalogMetalsBuyItems} from '../../scripts/shared/catalogItems.js';
import {catalogMetalsSellItems} from '../../scripts/shared/catalogItems.js';

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
      const lang = localStorage.getItem('lang') || (['en','ru','de'].includes((navigator.language||'en').slice(0,2)) ? (navigator.language||'en').slice(0,2) : 'en');
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
    })
    .catch(err => console.error(err));

  window.initMetalsBuyPage();
  window.initMetalsSellPage();
});

const _sup = ['en', 'ru', 'de'];
const _br = (navigator.language || 'en').slice(0, 2).toLowerCase();
const lang = localStorage.getItem('lang') || (_sup.includes(_br) ? _br : 'en');
const buttons = translations[lang].buttons;

function initMetalsSellPage() {
  const grid = document.getElementById('sell-catalog');
  const searchInput = document.getElementById('sell-search-input');
  const searchBtn = document.getElementById('sell-search-btn');

  function renderItem(item) {
    const card = document.createElement('div');
    card.className = 'catalog__card';

    const img = document.createElement('img');
    img.src = item.image;
    img.loading = 'lazy';
    img.alt = item.title;
    img.className = 'catalog__image';

    const body = document.createElement('div');
    body.className = 'catalog__body';

    const title = document.createElement('span');
    title.className = 'catalog__item-title';
    title.textContent = item.title;

    let tagsContainer = null;
    if (item.tags.length > 0) {
      tagsContainer = document.createElement('div');
      tagsContainer.className = 'catalog__tags';
      item.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = t;
        tagsContainer.appendChild(tag);
      });
    }

    const desc = document.createElement('p');
    desc.className = 'catalog__description';
    desc.textContent = item.description;

    const btn = document.createElement('a');
    btn.className = 'button-long-white catalog__action';
    btn.href = 'placing-order.html';
    btn.textContent = 'Sell Product';
    btn.dataset.i18n = 'buttons.sellBtn';

    btn.addEventListener('click', () => {
      localStorage.setItem('order-key', item.id);
    });

    body.append(title);
    if (tagsContainer) body.append(tagsContainer);
    body.append(desc);
    card.append(img, body, btn);
    grid.appendChild(card);
  }

  catalogMetalsSellItems.forEach(renderItem);

  const sellButton = document.getElementById('sell-btn');
  const sellPage = document.getElementById('sell-page');
  const buyPage = document.getElementById('buy-page');
  sellButton.addEventListener('click', e => {
    buyPage.classList.toggle('hidden');
    sellPage.classList.remove('hidden');
  });

  searchBtn.addEventListener('click', e => {
    const q = searchInput.value.trim().toLowerCase();
    grid.innerHTML = '';

    const filtered = q === ''
      ? catalogMetalsSellItems
      : catalogMetalsSellItems.filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some(tag => tag.toLowerCase().includes(q))
        );
      });

    filtered.forEach(renderItem);
  });
}

function initMetalsBuyPage() {
  const grid = document.getElementById('buy-catalog');
  const searchInput = document.getElementById('buy-search-input');
  const searchBtn = document.getElementById('buy-search-btn');

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

    let tagsContainer = null;
    if (item.tags.length > 0) {
      tagsContainer = document.createElement('div');
      tagsContainer.className = 'catalog__tags';
      item.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = t;
        tagsContainer.appendChild(tag);
      });
    }

    const desc = document.createElement('p');
    desc.className = 'catalog__description';
    desc.textContent = item.description;

    const btn = document.createElement('a');
    btn.className = 'button-long-white catalog__action';
    btn.href = 'placing-order.html';
    btn.textContent = 'Buy Product';
    btn.dataset.i18n = 'buttons.buyBtn';

    btn.addEventListener('click', () => {
      localStorage.setItem('order-key', item.id);
    });

    body.append(title);
    if (tagsContainer) body.append(tagsContainer);
    body.append(desc);
    card.append(img, body, btn);
    grid.appendChild(card);
  }

  catalogMetalsBuyItems.forEach(renderItem);

  searchBtn.addEventListener('click', e => {
    const q = searchInput.value.trim().toLowerCase();
    grid.innerHTML = '';

    const filtered = q === ''
      ? catalogMetalsBuyItems
      : catalogMetalsBuyItems.filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some(tag => tag.toLowerCase().includes(q))
        );
      });

    filtered.forEach(renderItem);
  });

  const buyButton = document.getElementById('buy-btn');
  const sellPage = document.getElementById('sell-page');
  const buyPage = document.getElementById('buy-page');
  buyButton.addEventListener('click', () => {
    buyPage.classList.remove('hidden');
    sellPage.classList.toggle('hidden');
  });
}

window.initMetalsBuyPage = initMetalsBuyPage;
window.initMetalsSellPage = initMetalsSellPage;
