import {
  catalogItems,
  catalogServiceItems,
  catalogItemsTranslations
} from '../../scripts/shared/catalogItems.js';

const _sup = ['en', 'ru', 'de'];
const _br = (navigator.language || 'en').slice(0, 2).toLowerCase();
const lang = localStorage.getItem('lang') || (_sup.includes(_br) ? _br : 'en');
const buttons = catalogItemsTranslations[lang].buttons;

function initMetalsCatalog() {
  const container = document.getElementById('catalog-metals-placeholder');
  if (!container) return;

  const catalog = container.querySelector('.catalog');
  if (!catalog) return;

  const grid = catalog.querySelector('.catalog__grid');
  if (!grid) return;

  // Header
  const wrapper = document.createElement('div');
  wrapper.classList.add('catalog__title');

  const titleBlock = document.createElement('div');
  titleBlock.classList.add('title');

  const aHeading = document.createElement('a');
  aHeading.textContent = 'CATALOG OF ';
  aHeading.dataset.i18n = 'catalog.titleOrd';

  const spanSub = document.createElement('span');
  spanSub.textContent = 'RAW METALS';
  spanSub.dataset.i18n = 'catalog.components.metals.titleBlue';

  const descTitle = document.createElement('p');
  descTitle.textContent = 'View the entire catalog of raw materials with a convenient filter for buying or selling';
  descTitle.dataset.i18n = 'catalog.components.metals.subtitle';

  titleBlock.append(aHeading, spanSub, descTitle);

  const fullBtn = document.createElement('a');
  fullBtn.classList.add('button', 'catalog-btn');
  fullBtn.href = '/buy-sell-product.html';
  fullBtn.textContent = 'Full Catalog';
  fullBtn.dataset.i18n = 'buttons.catalogBtn';

  wrapper.append(titleBlock, fullBtn);

  const gridParent = grid.parentNode;
  gridParent.insertBefore(wrapper, grid);

  // Cards
  catalogItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'catalog__card';

    const img = document.createElement('img');
    img.src = item.image || '';
    img.alt = item.title || '';
    img.loaded = 'lazy';
    img.className = 'catalog__image';

    const body = document.createElement('div');
    body.className = 'catalog__body';

    const title = document.createElement('span');
    title.className = 'catalog__item-title';
    title.textContent = item.title;
    title.dataset.i18n = `metals.${item.id}.title`;

    body.appendChild(title);

    if (Array.isArray(item.tags) && item.tags.length > 0) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'catalog__tags';
      item.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = t;
        tagsContainer.appendChild(tag);
      });
      body.appendChild(tagsContainer);
    }

    const desc = document.createElement('p');
    desc.className = 'catalog__description';
    desc.textContent = item.description;
    desc.dataset.i18n = `metals.${item.id}.description`;

    const btn = document.createElement('a');
    btn.className = 'button-long-white catalog__action';
    btn.href = 'placing-order.html';
    btn.textContent = buttons[item.type] ?? buttons.buyBtn;
    btn.dataset.i18n = (buttons[item.type] === buttons.buyBtn) ? 'buttons.buyBtn' : 'buttons.sellBtn';

    btn.addEventListener('click', () => {
      localStorage.setItem('order-key', item.id);
    });

    body.appendChild(desc);
    card.append(img, body, btn);
    grid.appendChild(card);
  });

  const prevBtn = container.querySelector('.pager__btn[aria-label="Previous"]');
  const nextBtn = container.querySelector('.pager__btn[aria-label="Next"]');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -grid.clientWidth, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      grid.scrollBy({ left: grid.clientWidth, behavior: 'smooth' });
    });
  }
}

function initServicesCatalog() {
  const container = document.getElementById('catalog-services-placeholder');
  if (!container) return;

  const catalog = container.querySelector('.catalog');
  if (!catalog) return;

  const grid = catalog.querySelector('.catalog__grid');
  if (!grid) return;

  // Header
  const wrapper = document.createElement('div');
  wrapper.classList.add('catalog__title');

  const titleBlock = document.createElement('div');
  titleBlock.classList.add('title');

  const aHeading = document.createElement('a');
  aHeading.textContent = 'CATALOG OF ';
  aHeading.dataset.i18n = 'catalog.titleOrd';

  const spanSub = document.createElement('span');
  spanSub.textContent = 'ENGINEERING SERVICES';
  spanSub.dataset.i18n = 'catalog.components.services.titleBlue';

  const descTitle = document.createElement('p');
  descTitle.textContent = 'View the entire catalog of engineering services';
  descTitle.dataset.i18n = 'catalog.components.services.subtitle';

  titleBlock.append(aHeading, spanSub, descTitle);

  const fullBtn = document.createElement('a');
  fullBtn.classList.add('button', 'catalog-btn');
  fullBtn.href = '/service.html';
  fullBtn.textContent = 'Full Catalog';
  fullBtn.dataset.i18n = 'buttons.catalogBtn';

  wrapper.append(titleBlock, fullBtn);

  const gridParent = grid.parentNode;
  gridParent.insertBefore(wrapper, grid);

  catalogServiceItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'catalog__card';

    const img = document.createElement('img');
    img.src = item.image || '';
    img.alt = item.title || '';
    img.loaded = 'lazy';
    img.className = 'catalog__image';

    const body = document.createElement('div');
    body.className = 'catalog__body';

    const title = document.createElement('span');
    title.className = 'catalog__item-title';
    title.textContent = item.title;
    body.appendChild(title);

    if (Array.isArray(item.tags) && item.tags.length > 0) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'catalog__tags';
      item.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = t;
        tagsContainer.appendChild(tag);
      });
      body.appendChild(tagsContainer);
    }

    const desc = document.createElement('p');
    desc.className = 'catalog__description';
    desc.textContent = item.description;

    const btn = document.createElement('a');
    btn.className = 'button-long-white catalog__action';
    btn.href = 'placing-order.html';
    btn.textContent = 'Order Service';
    btn.dataset.i18n = 'buttons.orderBtn';

    btn.textContent = buttons[item.type] ?? buttons.buyBtn;
    btn.dataset.i18n = (buttons[item.type] === buttons.buyBtn) ? 'buttons.buyBtn' : 'buttons.sellBtn';

    btn.addEventListener('click', () => {
      localStorage.setItem('order-key', item.id ?? 'service');
    });

    body.appendChild(desc);
    card.append(img, body, btn);
    grid.appendChild(card);
  });

  const prevBtn = container.querySelector('.pager__btn[aria-label="Previous"]');
  const nextBtn = container.querySelector('.pager__btn[aria-label="Next"]');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -grid.clientWidth, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      grid.scrollBy({ left: grid.clientWidth, behavior: 'smooth' });
    });
  }
}

window.initServicesCatalog = initServicesCatalog;
window.initMetalsCatalog = initMetalsCatalog;
