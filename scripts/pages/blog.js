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
      const lang = getActiveLang();
      if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
    })
    .catch(err => console.error(err));

  initBlog();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseYMDdot(dateStr) {
  const parts = dateStr.split('.').map(n => parseInt(n, 10));
  return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
}

function parseDate(dateStr) {
  return dateStr.includes('-') ? new Date(dateStr) : parseYMDdot(dateStr);
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
    views:       post.views != null ? post.views : null,
    action:      labels[lang] || labels.en,
  };
}

// ── Card builder ──────────────────────────────────────────────────────────────

function makeInfoItem(iconSrc, text) {
  const el = document.createElement('div');
  el.className = 'blog-section__info-item';
  const icon = document.createElement('img');
  icon.src = iconSrc;
  icon.alt = '';
  icon.loading = 'lazy';
  el.appendChild(icon);
  el.appendChild(document.createTextNode(text));
  return el;
}

function buildCard(item, className) {
  const gridItem = document.createElement('div');
  gridItem.className = className;

  const imageContainer = document.createElement('div');
  imageContainer.className = 'blog-section__image-container';

  const img = document.createElement('img');
  img.className = className === 'blog__grid-item' ? 'blog__grid__image' : 'blog-section__image';
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
  content.className = className === 'blog__grid-item' ? 'blog__content' : 'blog-section__content';

  const title = document.createElement('div');
  title.className = 'blog-section__title';
  title.textContent = item.title;
  content.appendChild(title);

  const description = document.createElement('div');
  description.className = 'blog-section__description';
  description.textContent = item.description;
  content.appendChild(description);

  const info = document.createElement('div');
  info.className = 'blog-section__info';
  if (item.time) info.appendChild(makeInfoItem('../../public/images/icons/time.svg', item.time));
  if (item.views != null) info.appendChild(makeInfoItem('../../public/images/icons/view.svg', item.views));
  info.appendChild(makeInfoItem('../../public/images/icons/calendar-date.svg', item.date));
  content.appendChild(info);

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
    actionBtn.addEventListener('click', () => { localStorage.setItem('selectedArticleId', item.id); });
  }
  content.appendChild(actionBtn);

  gridItem.appendChild(imageContainer);
  gridItem.appendChild(content);
  return gridItem;
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function initBlog() {
  const lang = getActiveLang();
  let allItems = [];
  let categories = [];
  try {
    const [postsResp, catsResp] = await Promise.all([
      fetch(`/api/blog/posts?lang=${lang}&per_page=100`),
      fetch('/api/blog/categories'),
    ]);
    if (postsResp.ok) {
      const data = await postsResp.json();
      allItems = data.data.map(p => mapFastmarketsItem(p, lang));
    }
    if (catsResp.ok) {
      categories = await catsResp.json();
    }
  } catch (e) {
    console.warn('Blog API unavailable');
  }

  initNewBlog(allItems);
  initAllBlog(allItems, categories);
}

function initNewBlog(items) {
  const grid = document.querySelector('.blog__new__grid');
  if (!grid) return;
  grid.innerHTML = '';

  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const minDate = new Date(now);
  minDate.setDate(minDate.getDate() - 7);
  minDate.setHours(0, 0, 0, 0);

  const newItems = items
    .filter(item => {
      const d = parseDate(item.date);
      return !isNaN(d) && d >= minDate && d <= now;
    })
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  newItems.forEach(item => grid.appendChild(buildCard(item, 'blog-section__grid-item')));

  const prevBtn = document.getElementById('new__pager-prev');
  const nextBtn = document.getElementById('new__pager-next');
  if (prevBtn && nextBtn) {
    const scrollAmt = grid.clientWidth;
    prevBtn.addEventListener('click', () => grid.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => grid.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
  }
}

function initAllBlog(items, apiCategories) {
  const grid    = document.querySelector('.blog__all__grid');
  const search  = document.querySelector('.blog__all__search');
  const allPill = document.getElementById('tag-all');
  if (!grid || !allPill) return;

  const PAGE_SIZE = 12;
  let pool = [];
  let rendered = 0;
  let observer = null;

  const sentinel = document.createElement('div');
  grid.after(sentinel);

  function renderMore() {
    const batch = pool.slice(rendered, rendered + PAGE_SIZE);
    batch.forEach(item => grid.appendChild(buildCard(item, 'blog__grid-item')));
    rendered += batch.length;
    if (rendered >= pool.length && observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function watchSentinel() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) renderMore();
    }, { rootMargin: '300px' });
    observer.observe(sentinel);
  }

  function renderAll(filterTag) {
    grid.innerHTML = '';
    rendered = 0;
    pool = (filterTag
      ? items.filter(item => item.tags.includes(filterTag))
      : items
    ).sort((a, b) => parseDate(b.date) - parseDate(a.date));
    renderMore();
    if (rendered < pool.length) watchSentinel();
  }

  const allTags = apiCategories.map(c => `#${c.name}`);

  allPill.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.search__tag.active').forEach(el => el.classList.remove('active'));
    allPill.classList.add('active');
    renderAll(null);
  });

  allTags.forEach(tagText => {
    const pill = document.createElement('a');
    pill.className = 'search__tag';
    pill.textContent = tagText;
    pill.href = '#';
    pill.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.search__tag.active').forEach(el => el.classList.remove('active'));
      pill.classList.add('active');
      renderAll(tagText);
    });
    if (search) search.appendChild(pill);
  });

  renderAll(null);
  initMobileFilter(search);
}

function initMobileFilter(search) {
  const toggle   = document.getElementById('blog-filter-toggle');
  const backdrop = document.getElementById('blog-filter-backdrop');
  const sheet    = document.getElementById('blog-filter-sheet');
  const closeBtn = document.getElementById('blog-filter-close');
  const sheetTags = document.getElementById('blog-filter-sheet-tags');
  const activeLabel = document.getElementById('blog-filter-active');
  if (!toggle || !sheet || !sheetTags) return;

  function syncTagsToSheet() {
    sheetTags.innerHTML = '';
    if (!search) return;
    Array.from(search.children).forEach(tag => {
      const clone = tag.cloneNode(true);
      clone.addEventListener('click', e => {
        e.preventDefault();
        tag.click();
        const label = tag.textContent.trim();
        if (activeLabel) activeLabel.textContent = label;
        closeSheet();
      });
      sheetTags.appendChild(clone);
    });
  }

  function openSheet() {
    syncTagsToSheet();
    backdrop.classList.add('open');
    sheet.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    backdrop.classList.remove('open');
    sheet.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openSheet);
  closeBtn && closeBtn.addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);
}

window.initBlog = initBlog;
export { initNewBlog };
