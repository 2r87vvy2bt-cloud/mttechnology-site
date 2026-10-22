function initTech() {
  const API_URL = '/api/feedback/client';

  const form = document.querySelector('.contact-form');

  const nameInput  = document.querySelector('#name') || document.querySelector('.name-input');
  const phoneInput = document.querySelector('#phone');
  const emailInput = document.querySelector('#email');
  const descInput  = document.querySelector('#description') || document.querySelector('.description-input');
  const sourceInput= document.querySelector('#source') || document.querySelector('.source-input');

  const submitButton  = form.querySelector('button[type="submit"]');
  const privacyCheckbox = document.querySelector('.form-checkbox');

  const phoneField = phoneInput?.closest('.form-field');
  const phoneErrorMessage = phoneField?.querySelector('.form-error-message');
  const emailField = emailInput?.closest('.form-field');

  const setFieldError = (inputEl, message) => {
    const field = inputEl?.closest?.('.form-field');
    if (!field) return;
    const msg = field.querySelector('.form-error-message');
    if (message) {
      field.classList.add('form-field--error');
      if (msg) msg.textContent = message;
    } else {
      field.classList.remove('form-field--error');
      if (msg) msg.textContent = '';
    }
  };

  function validatePhoneNumber(phone) {
    if (!phone || !phone.trim()) return true;
    const phonePattern = /^\+?\d{7,15}$/;
    return phonePattern.test(phone.trim());
  }
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
  }
  function validateName(name) {
    const v = (name || '').trim();
    return v.length >= 2 && v.length <= 128;
  }

  function validateForm() {
    const okPhone = validatePhoneNumber(phoneInput?.value || '');
    const okEmail = validateEmail(emailInput?.value || '');
    const okName  = validateName(nameInput?.value || '');

    if (phoneField && phoneErrorMessage) {
      if (okPhone) {
        phoneField.classList.remove('form-field--error');
        phoneErrorMessage.textContent = '';
      } else {
        phoneField.classList.add('form-field--error');
        phoneErrorMessage.textContent = 'Please enter a valid phone number';
      }
    } else {
      setFieldError(phoneInput, okPhone ? '' : 'Please enter a valid phone number');
    }
    if (emailField) {
      emailField.classList.toggle('form-field--error', !okEmail);
    } else {
      setFieldError(emailInput, okEmail ? '' : 'Please enter a valid email');
    }
    setFieldError(nameInput, okName ? '' : 'Please enter your name (2–128 chars)');

    if (!privacyCheckbox?.checked) {
      setFieldError(privacyCheckbox, 'Required');
    }

    return okPhone && okEmail && okName && privacyCheckbox?.checked;
  }

  async function postJson(url, data) {
    const res = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: (nameInput?.value || '').trim(),
      email: (emailInput?.value || '').trim(),
    };
    const phone = (phoneInput?.value || '').trim();
    const description = (descInput?.value || '').trim();
    const source =
      (sourceInput?.value || '').trim() ||
      document.querySelector('main')?.dataset?.source ||
      document.title ||
      'Index page';

    if (phone) payload.phone = phone;
    if (description) payload.description = description;
    if (source) payload.source = source;

    submitButton.disabled = true;
    const prevText = submitButton.textContent;
    submitButton.textContent = 'Sending…';

    try {
      const res = await postJson(API_URL, payload);

      if (res.ok) {
        form.reset();
        setFieldError(nameInput, '');
        setFieldError(emailInput, '');
        setFieldError(phoneInput, '');
        alert('Thanks! Your message has been sent.');
        return;
      }

      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/problem+json')) {
        const problem = await res.json();

        if (problem.errors && typeof problem.errors === 'object') {
          Object.entries(problem.errors).forEach(([field, msgs]) => {
            const first = Array.isArray(msgs) ? msgs[0] : String(msgs);
            const el =
              form.querySelector(`#${field}`) ||
              form.querySelector(`.${field}-input`);
            if (el) setFieldError(el, first);
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
      submitButton.disabled = false;
      submitButton.textContent = prevText || 'Send';
    }
  });
}

window.initTech = initTech;

function initLeafletMap() {
  if (!document.getElementById('leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  function createMap() {
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl || mapEl._leaflet_id) return;

    const lat = 42.69472445016428;
    const lng = 23.319006734911866;

    const map = L.map('leaflet-map').setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(
      '<strong>MT TECHNOLOGY LTD</strong><br>Sofia 1000, 19 Lavele St.<br>floor 5, apt. 3'
    ).openPopup();
  }

  if (typeof L !== 'undefined') {
    createMap();
  } else {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = createMap;
    document.head.appendChild(script);
  }
}

window.initLeafletMap = initLeafletMap;
