import { allProducts } from '../../scripts/shared/catalogItems.js';

const API_URL = '/api/feedback/client';

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

  initOrder();
});

function initOrder() {
  const order = document.querySelector('.order__container__card');
  const descInput  = document.querySelector('#description') || document.querySelector('.description-input');
  order.innerHTML = '';
  const orderKey = localStorage.getItem('order-key');
  const item = allProducts.find(item => item.id === orderKey);

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('pagination-btn', 'pagination-btn--left');

  const svgNS = 'http://www.w3.org/2000/svg';

  const leftArrowImage = document.createElementNS(svgNS, 'svg');
  leftArrowImage.setAttribute('class', 'icon-arrow');
  leftArrowImage.setAttribute('width', '32');
  leftArrowImage.setAttribute('height', '32');
  leftArrowImage.setAttribute('viewBox', '0 0 24 24');
  leftArrowImage.setAttribute('fill', 'none');
  leftArrowImage.setAttribute('aria-label', 'Previous slide');

  const leftArrowPath = document.createElementNS(svgNS, 'path');
  leftArrowPath.setAttribute('d', 'M19 12H5M5 12L12 19M5 12L12 5');
  leftArrowImage.appendChild(leftArrowPath);
  prevBtn.appendChild(leftArrowImage);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('pagination-btn', 'pagination-btn--right');

  const rightArrowImage = document.createElementNS(svgNS, 'svg');
  rightArrowImage.setAttribute('class', 'icon-arrow');
  rightArrowImage.setAttribute('width', '32');
  rightArrowImage.setAttribute('height', '32');
  rightArrowImage.setAttribute('viewBox', '0 0 24 24');
  rightArrowImage.setAttribute('fill', 'none');
  rightArrowImage.setAttribute('aria-label', 'Next slide');

  const rightArrowPath = document.createElementNS(svgNS, 'path');
  rightArrowPath.setAttribute('d', 'M5 12H19M19 12L12 5M19 12L12 19');
  rightArrowImage.appendChild(rightArrowPath);
  nextBtn.appendChild(rightArrowImage);

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  const slider = document.createElement('div');
  slider.className = 'order__slider';

  slider.appendChild(prevBtn);

  const wrapper = document.createElement('div');
  wrapper.className = 'order__slides-wrapper';

  item.images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');

    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy'
    img.alt = item.title;

    slide.appendChild(img);
    wrapper.appendChild(slide);
  });

  let current = 0,
    count = item.images.length,
    timer;
  const slides = wrapper.querySelectorAll('.slide');

  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'order__pagination-container';

  const pagination = document.createElement('div');
  pagination.className = 'order__pagination';

  for (let i = 0; i < count; i++) {
    const paginationItem = document.createElement('div');
    paginationItem.classList.add('pagination-item');
    paginationItem.dataset.index = i;
    pagination.appendChild(paginationItem);

    paginationItem.addEventListener('click', () => {
      showSlide(i);
      resetAutoAdvance();
    });
  }

  paginationContainer.appendChild(pagination);

  slider.appendChild(wrapper);
  slider.appendChild(paginationContainer);
  slider.appendChild(nextBtn);
  order.appendChild(slider);

  function showSlide(idx) {
    slides[current].classList.remove('active');
    slides[idx].classList.add('active');
    current = idx;

    const paginationItems = document.querySelectorAll('.pagination-item');
    paginationItems.forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
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

  setInterval(nextSlide, 15000);

  const title = document.createElement('div');
  title.className = 'card__title';
  title.textContent = item.title;
  order.appendChild(title);

  if (item.tags.length > 0) {
    const tagsWrapper = document.createElement('div');
    tagsWrapper.className = 'card__tags';
    item.tags.forEach(tagText => {
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.textContent = tagText;
      tagsWrapper.appendChild(tag);
    });
    order.appendChild(tagsWrapper);
  }

  const desc = document.createElement('div');
  desc.className = 'card__description';
  desc.textContent = item.description;
  order.appendChild(desc);

  showSlide(0);

  function setupPlacingOrderForm() {
    const form = document.querySelector('.order__form');
    if (!form) return;

    const _lang = localStorage.getItem('lang') || 'en';
    const _t = (window.translations && window.translations[_lang] && window.translations[_lang].form) || {};
    const msg = {
      nameRequired: _t.nameRequired || 'Name is required',
      emailRequired: _t.emailRequired || 'Email is required',
      emailInvalid: _t.emailInvalid || 'Please enter a valid email',
      phoneInvalid: _t.phoneInvalid || 'Please enter a valid phone number',
      policyRequired: _t.policyRequired || 'Please agree with our Privacy Policy',
      sending: _t.sending || 'Sending…',
    };

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    const privacyCheckbox = form.querySelector('.form-checkbox');

    const nameField = nameInput.closest('.form-field');
    const emailField = emailInput.closest('.form-field');
    const phoneField = phoneInput.closest('.form-field');

    function ensureErrorEl(field) {
      let el = field.querySelector('.form-error-message');
      if (!el) {
        el = document.createElement('p');
        el.className = 'form-error-message';
        field.appendChild(el);
      }
      return el;
    }
    const nameError = ensureErrorEl(nameField);
    const emailError = ensureErrorEl(emailField);
    const phoneError = ensureErrorEl(phoneField);

    function mark(fieldEl, msgEl, hasError, message = '') {
      fieldEl.classList.toggle('form-field--error', hasError);
      msgEl.textContent = hasError ? message : '';
    }

    function validateEmail(email) {
      const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return rx.test(email);
    }

    function validatePhone(phone) {
      if (!phone) return true; // optional
      const rx = /^\+?\d{7,15}$/;
      return rx.test(phone);
    }

    function validateForm() {
      let ok = true;
      let firstRequiredInvalid = null;

      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        mark(nameField, nameError, true, msg.nameRequired);
        ok = false;
        if (!firstRequiredInvalid) firstRequiredInvalid = nameInput;
      } else {
        mark(nameField, nameError, false);
      }

      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        mark(emailField, emailError, true, msg.emailRequired);
        ok = false;
        if (!firstRequiredInvalid) firstRequiredInvalid = emailInput;
      } else if (!validateEmail(emailVal)) {
        mark(emailField, emailError, true, msg.emailInvalid);
        ok = false;
        if (!firstRequiredInvalid) firstRequiredInvalid = emailInput;
      } else {
        mark(emailField, emailError, false);
      }

      const phoneVal = phoneInput.value.trim();
      if (phoneVal && !validatePhone(phoneVal)) {
        mark(phoneField, phoneError, true, msg.phoneInvalid);
        ok = false;
        if (!firstRequiredInvalid) firstRequiredInvalid = phoneInput;
      } else {
        mark(phoneField, phoneError, false);
      }

      if (privacyCheckbox && !privacyCheckbox.checked) {
        alert(msg.policyRequired);
        ok = false;
      }

      return { ok, firstRequiredInvalid };
    }

    async function postJson(url, data) {
      const res = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res;
    }

    const submitEl =
      form.querySelector('button[type="submit"]') ||
      document.querySelector('.order__buttons .button.button__large.order-btn');

    function setSubmitting(submitting) {
      if (!submitEl) return;
      const isButton = submitEl.tagName.toLowerCase() === 'button';
      if (isButton) {
        submitEl.disabled = submitting;
        if (submitting) {
          submitEl.dataset.prevText = submitEl.textContent;
          submitEl.textContent = msg.sending;
        } else {
          submitEl.textContent = submitEl.dataset.prevText || msg.sending.replace('…', '');
        }
      } else {
        // anchor fallback
        submitEl.setAttribute('aria-disabled', submitting ? 'true' : 'false');
        submitEl.classList.toggle('is-loading', submitting);
      }
    }

    const sendAnchor = document.querySelector('.order__buttons .button.button__large.order-btn');
    if (sendAnchor && sendAnchor.tagName.toLowerCase() === 'a') {
      sendAnchor.addEventListener('click', (evt) => {
        evt.preventDefault();
        form.requestSubmit();
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const { ok, firstRequiredInvalid } = validateForm();

      if (!ok) {
        if (firstRequiredInvalid) {
          firstRequiredInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => firstRequiredInvalid.focus({ preventScroll: true }), 300);
        }
        return;
      }

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
      };
      const phone = phoneInput.value.trim();
      if (phone) payload.phone = phone;

      const description = (descInput?.value || '').trim();
      const source = `Order request for "${item.title}" (id: ${item.id}).`

      payload.description = description;
      payload.source = source;

      setSubmitting(true);

      try {
        const res = await postJson(API_URL, payload);

        if (res.ok) {
          // Google Ads conversion: fires only on a successful order request.
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
              send_to: 'AW-18246770209/QutVCJHQvsAcEKG83vxD',
              value: 1.0,
              currency: 'EUR',
            });
          }
          form.reset();
          mark(nameField, nameError, false);
          mark(emailField, emailError, false);
          mark(phoneField, phoneError, false);
          alert('Thanks! Your order request has been sent.');
          return;
        }

        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/problem+json')) {
          const problem = await res.json();

          if (problem.errors && typeof problem.errors === 'object') {
            Object.entries(problem.errors).forEach(([field, msgs]) => {
              const first = Array.isArray(msgs) ? msgs[0] : String(msgs);
              if (field === 'name') mark(nameField, nameError, true, first);
              if (field === 'email') mark(emailField, emailError, true, first);
              if (field === 'phone') mark(phoneField, phoneError, true, first);
            });
          }

          alert(problem.title || 'Failed to send. Please check the form.');
        } else {
          const text = await res.text();
          alert(`Send failed (${res.status}). ${text}`);
        }
      } catch (err) {
        console.error(err);
        alert('Network error. Please try again.');
      } finally {
        setSubmitting(false);
      }
    });

    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) mark(nameField, nameError, false);
    });

    emailInput.addEventListener('input', () => {
      const v = emailInput.value.trim();
      if (v && validateEmail(v)) mark(emailField, emailError, false);
    });

    phoneInput.addEventListener('input', () => {
      const v = phoneInput.value.trim();
      if (validatePhone(v)) mark(phoneField, phoneError, false);
    });
  }

  setupPlacingOrderForm();
}
window.initOrder = initOrder;
