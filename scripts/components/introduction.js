function initIntroduction() {
  const slides = [
    'eng',
    'wire',
    'shavings',
    'scrap',
    'purchase',
  ];

  const descriptions = {
    en: [
      'Engineering \nservices',
      'We buy and sell \ncopper wire',
      'We buy and sell \nmetal shavings',
      'We buy \nelectronic scrap',
      'Purchase and sale \nof raw materials'
    ],
    ru: [
      'Инженерные \nуслуги',
      'Мы покупаем и \nпродаем медную \nпроволоку',
      'Мы покупаем и \nпродаем металлическую \nстружку',
      'Мы покупаем \nэлектронный лом',
      'Покупка и продажа \nсырья'
    ],
    de: [
      'Ingenieurleistungen',
      'Wir kaufen und \nverkaufen Kupferdraht',
      'Wir kaufen und \nverkaufen Metallspäne',
      'Wir kaufen \nElektronikschrott',
      'An- und Verkauf \nvon Rohstoffen'
    ],
    bg: [
      'Инженерни \nуслуги',
      'Купуваме и \nпродаваме меден проводник',
      'Купуваме и \nпродаваме метални стружки',
      'Изкупуваме \nелектронен скрап',
      'Покупка и продажба \nна суровини'
    ]
  };

  const _supported = ['en', 'ru', 'de', 'bg'];
  const _browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const _default = _supported.includes(_browser) ? _browser : 'en';
  const lang = localStorage.getItem('lang') || _default;
  let description = descriptions[lang] || descriptions.en;

  const screenType = window.innerWidth < 786
    ? slides.map(slide => slide + '-mob.png')
    : slides.map(slide => slide + '.png');

  const wrapper = document.querySelector('.slides-wrapper');
  const dots = document.querySelector('.smart-metal-sourcing__pagination');
  const textEl = document.querySelector('.smart-metal-sourcing__img-desc');

  const nextBtn = document.querySelector('.pagination-btn--right');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  }

  const prevBtn = document.querySelector('.pagination-btn--left');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  }

  wrapper.innerHTML = '';
  dots.innerHTML = '';

  screenType.forEach((filename, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');
    const img = document.createElement('img');
    img.src = `../../public/images/metal-sourcing/${filename}`;
    img.loading = 'lazy';
    slide.appendChild(img);
    wrapper.appendChild(slide);
  });

  screenType.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'pagination-item' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dots.appendChild(dot);
    dot.addEventListener('click', () => {
      showSlide(i);
      resetAutoAdvance();
    });
  });

  let current = 0,
    count = screenType.length,
    timer;

  if (textEl) textEl.textContent = description[current];

  function showSlide(idx) {
    if (idx === current) return;
    wrapper.querySelector(`.slide:nth-child(${current + 1})`).classList.remove('active');
    wrapper.querySelector(`.slide:nth-child(${idx + 1})`).classList.add('active');
    dots.children[current].classList.remove('active');
    dots.children[idx].classList.add('active');
    textEl.dataset.i18n = 'introduction.slides.slider' + idx;
    if (textEl) textEl.textContent = description[idx];
    current = idx;
  }

  function nextSlide() {
    showSlide((current + 1) % count);
  }

  function prevSlide() {
    const prev = (current - 1 + count) % count;
    showSlide(prev);
  }

  function startAuto() {
    timer = setInterval(nextSlide, 10000);
  }

  function resetAutoAdvance() {
    clearInterval(timer);
    startAuto();
  }

  startAuto();
}

window.initIntroduction = initIntroduction;
