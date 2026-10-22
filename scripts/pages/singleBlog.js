
import { renderCard, mapFastmarketsItem, getActiveLang } from '../components/blogSection.js';

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

  const fmId = new URLSearchParams(window.location.search).get('fm');
  if (fmId) {
    initFastmarketsBlog(parseInt(fmId));
  } else {
    initSingleBlog();
  }
});


function initSingleBlog() {
  const id = localStorage.getItem('selectedArticleId');
  const article = articles.find(a => a.id === id);

  if (!article) {
    document.querySelector('.single-blog__title').textContent = 'Article not found';
    return;
  }

  const topImage = document.getElementById('top-image');
  topImage.src = article.headerImage;
  topImage.alt = article.title;
  topImage.className = 'top-image';

  const title = document.querySelector('.single-blog__title');
  title.innerText = article.title;

  const tagsContainer = document.querySelector('.single-blog__tags');
  article.tags.forEach(tag => {
    const tagDiv = document.createElement('div');
    tagDiv.className = 'blog-section__tag';
    tagDiv.innerText = tag;
    tagsContainer.appendChild(tagDiv);
  });

  const readTimeEl = document.getElementById('read-time');
  readTimeEl.innerHTML = '';

  const timeIcon = document.createElement('img');
  timeIcon.src = "../../public/images/icons/clock.svg";
  timeIcon.alt = "Read time";
  timeIcon.loading = 'lazy';

  readTimeEl.prepend(timeIcon);
  readTimeEl.append(` ${article.readTime}`);

  const viewsEl = document.getElementById('views');
  viewsEl.innerHTML = '';

  const viewsIcon = document.createElement('img');
  viewsIcon.src = "../../public/images/icons/views.svg";
  viewsIcon.alt = "Views";
  viewsIcon.loading = 'lazy';

  viewsEl.prepend(viewsIcon);
  viewsEl.append(` ${article.views}`);

  const dateEl = document.getElementById('date');
  dateEl.innerHTML = '';

  const dateIcon = document.createElement('img');
  dateIcon.src = "../../public/images/icons/date.svg";
  dateIcon.alt = "Published date";
  dateIcon.loading = 'lazy';

  dateEl.prepend(dateIcon);
  dateEl.append(` ${article.date}`);

  const articleContent = document.querySelector('.single-blog__text');

  article.sections.forEach((section) => {
    const subtitle = document.createElement('div');
    subtitle.className = 'single-blog__text__subtitle';
    subtitle.innerText = section.subtitle;

    const description = document.createElement('div');
    description.className = 'single-blog__text__description';
    description.innerText = section.description;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'single-blog__text__img';


    const img = document.createElement('img');
    if (section.image) {
      img.src = section.image;
      img.alt = section.subtitle;
      img.loading = 'lazy';
      imageContainer.appendChild(img);
      articleContent.append(subtitle, description, imageContainer);
    } else {
      articleContent.append(subtitle, description);
    }

  });

  const articlesKeys = document.querySelector('.single-blog__nav__keys');
  article.sections.forEach((section) => {
    const key = document.createElement('div');
    key.className = 'single-blog__nav__key';
    key.innerText = section.subtitle;

    articlesKeys.appendChild(key);
  });

  const subtitleEls = Array.from(
    document.querySelectorAll('.single-blog__text__subtitle'),
  );
  const navKeyEls = Array.from(
    document.querySelectorAll('.single-blog__nav__key'),
  );

  navKeyEls.forEach((keyEl, idx) => {
    keyEl.addEventListener('click', () => {
      subtitleEls[idx].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      navKeyEls.forEach(k => k.classList.remove('active'));
      keyEl.classList.add('active');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const idx = subtitleEls.indexOf(entry.target);
      if (idx < 0) return;

      navKeyEls.forEach(k => k.classList.remove('active'));
      navKeyEls[idx].classList.add('active');
    });
  }, {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  });
  subtitleEls.forEach(el => observer.observe(el));

  initNewPublications(null);
}

window.initSingleBlog = initSingleBlog;

function decodeHtmlEntities(str) {
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

function renderInlineMarkup(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

async function initFastmarketsBlog(fmId) {
  const supported = ['en', 'ru', 'de', 'bg'];
  const saved = localStorage.getItem('lang');
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const lang = (saved && supported.includes(saved)) ? saved : (supported.includes(browser) ? browser : 'en');

  let post;
  try {
    const resp = await fetch(`/api/blog/posts/${fmId}?lang=${lang}`);
    if (!resp.ok) throw new Error('Not found');
    post = await resp.json();
  } catch (e) {
    document.querySelector('.single-blog__title').textContent = 'Article not found';
    return;
  }

  const topImage = document.getElementById('top-image');
  if (post.image_url) {
    topImage.src = post.image_url;
    topImage.alt = post.title;
    topImage.className = 'top-image';
  } else {
    topImage.style.display = 'none';
  }

  document.querySelector('.single-blog__title').textContent = decodeHtmlEntities(post.title);

  const tagsContainer = document.querySelector('.single-blog__tags');
  post.categories.forEach(cat => {
    const tagDiv = document.createElement('div');
    tagDiv.className = 'blog-section__tag';
    tagDiv.textContent = `#${cat}`;
    tagsContainer.appendChild(tagDiv);
  });

  const viewsEl = document.getElementById('views');
  if (viewsEl) {
    viewsEl.innerHTML = '';
    const icon = document.createElement('img');
    icon.src = '../../public/images/icons/views.svg';
    icon.alt = 'Views';
    icon.loading = 'lazy';
    viewsEl.appendChild(icon);
    viewsEl.append(` ${post.views}`);
  }

  const dateEl = document.getElementById('date');
  if (dateEl) {
    dateEl.innerHTML = '';
    const icon = document.createElement('img');
    icon.src = '../../public/images/icons/date.svg';
    icon.alt = 'Date';
    icon.loading = 'lazy';
    dateEl.appendChild(icon);
    dateEl.append(` ${post.date}`);
  }

  const readTimeEl = document.getElementById('read-time');
  if (readTimeEl) readTimeEl.style.display = 'none';

  const articleContent = document.querySelector('.single-blog__text');
  const subtitleEls = [];

  post.content.split('\n\n').forEach(para => {
    para = para.trim();
    if (!para) return;
    if (para.startsWith('**') && para.endsWith('**') && para.length > 4) {
      const h = document.createElement('div');
      h.className = 'single-blog__text__subtitle';
      h.textContent = para.slice(2, -2);
      articleContent.appendChild(h);
      subtitleEls.push(h);
    } else if (para.startsWith('[CHART:') && para.endsWith(']')) {
      const id = para.slice(7, -1);
      const wrap = document.createElement('div');
      wrap.className = 'single-blog__text__img';
      wrap.style.height = '500px';
      const iframe = document.createElement('iframe');
      iframe.src = `https://flo.uri.sh/visualisation/${id}/embed`;
      iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:1.5rem;';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('frameborder', '0');
      iframe.loading = 'lazy';
      wrap.appendChild(iframe);
      articleContent.appendChild(wrap);
    } else if (para.startsWith('[IMG:') && para.endsWith(']')) {
      const url = para.slice(5, -1);
      const wrap = document.createElement('div');
      wrap.className = 'single-blog__text__img';
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.loading = 'lazy';
      wrap.appendChild(img);
      articleContent.appendChild(wrap);
    } else {
      const p = document.createElement('p');
      p.className = 'single-blog__text__description';
      p.innerHTML = renderInlineMarkup(para);
      articleContent.appendChild(p);
    }
  });

  if (post.link) {
    const sourceEl = document.createElement('p');
    sourceEl.className = 'single-blog__text__description';
    sourceEl.style.marginTop = '1rem';
    sourceEl.style.opacity = '0.6';
    sourceEl.innerHTML = `${post.source} — <a href="${post.link}" target="_blank" rel="noopener noreferrer">Original article</a>`;
    articleContent.appendChild(sourceEl);
  }

  const navKeys = document.querySelector('.single-blog__nav__keys');
  if (navKeys && subtitleEls.length) {
    const navKeyEls = subtitleEls.map(subtitle => {
      const key = document.createElement('div');
      key.className = 'single-blog__nav__key';
      key.textContent = subtitle.textContent;
      navKeys.appendChild(key);
      return key;
    });

    navKeyEls.forEach((keyEl, idx) => {
      keyEl.addEventListener('click', () => {
        subtitleEls[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        navKeyEls.forEach(k => k.classList.remove('active'));
        keyEl.classList.add('active');
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = subtitleEls.indexOf(entry.target);
        if (idx < 0) return;
        navKeyEls.forEach(k => k.classList.remove('active'));
        navKeyEls[idx].classList.add('active');
      });
    }, { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    subtitleEls.forEach(el => observer.observe(el));
  }

  initNewPublications(fmId);
}


async function initNewPublications(excludeFmId = null) {
  const grid = document.querySelector('.blog__new__grid');
  if (!grid) return;

  const lang = getActiveLang();

  try {
    const resp = await fetch(`/api/blog/posts?lang=${lang}&per_page=10`);
    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();
    const posts = data.data.filter(p => p.id !== excludeFmId);
    posts.forEach(post => renderCard(mapFastmarketsItem(post, lang), grid));
  } catch (e) {
    console.warn('Blog API unavailable for new publications');
  }

  const prevBtn = document.getElementById('new__pager-prev');
  const nextBtn = document.getElementById('new__pager-next');
  if (prevBtn && nextBtn) {
    const scrollAmt = grid.clientWidth;
    prevBtn.addEventListener('click', () => grid.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => grid.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
  }
}

function updateReadingProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled   = window.scrollY;
  const pct        = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
  const blogEl = document.querySelector('.single-blog');
  blogEl.style.setProperty('--scroll-progress', pct + '%');
}

window.addEventListener('scroll', updateReadingProgress);
window.addEventListener('resize', updateReadingProgress);
document.addEventListener('DOMContentLoaded', updateReadingProgress);
