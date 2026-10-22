import { items } from '../../scripts/shared/blogItems.js';

function parseYMDdot(dateStr) {
  const parts = dateStr.split('.').map(n => parseInt(n, 10));
  return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
}

function isPublished(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseYMDdot(dateStr) <= today;
}

function getActiveLang() {
  const supported = ['en', 'ru', 'de', 'bg'];
  const saved = localStorage.getItem('lang');
  if (saved && supported.includes(saved)) return saved;
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return supported.includes(browser) ? browser : 'en';
}

const DEFAULT_IMAGE = '../../public/images/blog/fastmarkets-default.jpg';

function renderCard(item, grid) {
  const gridItem = document.createElement('div');
  gridItem.className = 'blog-section__grid-item';

  const imageContainer = document.createElement('div');
  imageContainer.className = 'blog-section__image-container';

  const img = document.createElement('img');
  img.className = 'blog-section__image';
  img.loading = 'lazy';
  img.src = item.image || DEFAULT_IMAGE;
  img.alt = item.title;
  img.onerror = () => { img.src = DEFAULT_IMAGE; };

  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'blog-section__tags';
  item.tags.forEach(tag => {
    const tagEl = document.createElement('a');
    tagEl.className = 'blog-section__tag';
    tagEl.textContent = tag;
    tagsContainer.appendChild(tagEl);
  });

  imageContainer.appendChild(img);
  imageContainer.appendChild(tagsContainer);

  const content = document.createElement('div');
  content.className = 'blog-section__content';

  const title = document.createElement('div');
  title.className = 'blog-section__title';
  title.textContent = item.title;

  const description = document.createElement('div');
  description.className = 'blog-section__description';
  description.textContent = item.description;

  const info = document.createElement('div');
  info.className = 'blog-section__info';

  const makeInfoItem = (iconSrc, text) => {
    const el = document.createElement('div');
    el.className = 'blog-section__info-item';
    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.loading = 'lazy';
    icon.alt = '';
    el.appendChild(icon);
    el.appendChild(document.createTextNode(text));
    return el;
  };

  if (item.time) info.appendChild(makeInfoItem('../../public/images/icons/time.svg', item.time));
  if (item.views != null) info.appendChild(makeInfoItem('../../public/images/icons/view.svg', item.views));
  info.appendChild(makeInfoItem('../../public/images/icons/calendar-date.svg', item.date));

  const actionBtn = document.createElement('a');
  actionBtn.className = 'button-long-white button__full blog-section__action';
  actionBtn.textContent = item.action;

  if (item.fmId) {
    actionBtn.href = `single-blog.html?fm=${item.fmId}`;
    actionBtn.addEventListener('click', () => {
      fetch(`/api/blog/posts/${item.fmId}/view`, { method: 'POST' }).catch(() => {});
    });
  } else {
    actionBtn.href = 'single-blog.html';
    actionBtn.dataset.i18n = 'buttons.detailsBtn';
    actionBtn.addEventListener('click', () => {
      localStorage.setItem('selectedArticleId', item.id);
    });
  }

  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(info);
  content.appendChild(actionBtn);

  gridItem.appendChild(imageContainer);
  gridItem.appendChild(content);
  grid.appendChild(gridItem);
}

function mapFastmarketsItem(post, lang) {
  const labels = { en: 'Read More', ru: 'Читать далее', de: 'Weiterlesen', bg: 'Прочети още' };
  return {
    id:          'fm_' + post.id,
    fmId:        post.id,
    image:       post.image_url || DEFAULT_IMAGE,
    tags:        post.categories.length ? post.categories.map(c => `#${c}`) : ['#Fastmarkets'],
    title:       post.title,
    description: post.excerpt,
    date:        post.date,
    time:        null,
    views:       post.views || null,
    action:      labels[lang] || labels.en,
  };
}

async function initBlogSection() {
  const container = document.getElementById('blog-placeholder');
  if (!container) return;

  const grid = document.querySelector('.blog-section__grid');
  if (!grid) return;

  const lang = getActiveLang();

  const hardcodedItems = items
    .filter(i => isPublished(i.date))
    .sort((a, b) => parseYMDdot(b.date) - parseYMDdot(a.date));

  grid.innerHTML = '';
  hardcodedItems.forEach(item => renderCard(item, grid));

  try {
    const resp = await fetch(`/api/blog/posts?lang=${lang}&per_page=6`);
    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();
    data.data.forEach(post => renderCard(mapFastmarketsItem(post, lang), grid));
  } catch (e) {
    console.warn('Blog API unavailable, showing local articles only');
  }

  const prevBtn = container.querySelector('.pager__btn[aria-label=Previous]');
  const nextBtn = container.querySelector('.pager__btn[aria-label=Next]');
  if (prevBtn && nextBtn) {
    const scrollAmt = grid.clientWidth;
    prevBtn.addEventListener('click', () => grid.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => grid.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
  }
}

window.initBlogSection = initBlogSection;

export { renderCard, mapFastmarketsItem, getActiveLang };
