// function initProjects() {
//   const API_URL = '/api/feedback/client';
//
//   const form = document.querySelector('.newsletter-form');
//
//   const emailInput = document.querySelector('#newsletter-email');
//
//   const submitButton  = form.querySelector('button[type="submit"]');
//
//   const emailField = emailInput?.closest('.form-field');
//
//   const setFieldError = (inputEl, message) => {
//     const field = inputEl?.closest?.('.form-field');
//     if (!field) return;
//     const msg = field.querySelector('.form-error-message');
//     if (message) {
//       field.classList.add('form-field--error');
//       if (msg) msg.textContent = message;
//     } else {
//       field.classList.remove('form-field--error');
//       if (msg) msg.textContent = '';
//     }
//   };
//
//   function validateEmail(email) {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email.trim());
//   }
//
//   function validateForm() {
//     const okEmail = validateEmail(emailInput?.value || '');
//
//     if (emailField) {
//       emailField.classList.toggle('form-field--error', !okEmail);
//     } else {
//       setFieldError(emailInput, okEmail ? '' : 'Please enter a valid email');
//     }
//
//     return okEmail;
//   }
//
//   async function postJson(url, data) {
//     const res = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     return res;
//   }
//
//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//
//     const payload = {
//       email: (emailInput?.value || '').trim(),
//     };
//     const description = 'This client interested about planned projects'
//     const source = 'Planned Projects section - Main page';
//
//     if (description) payload.description = description;
//     if (source) payload.source = source;
//
//     submitButton.disabled = true;
//     const prevText = submitButton.textContent;
//     submitButton.textContent = 'Sending…';
//
//     try {
//       const res = await postJson(API_URL, payload);
//
//       if (res.ok) {
//         form.reset();
//         setFieldError(emailInput, '');
//         alert('Thanks! Your message has been sent.');
//         return;
//       }
//
//       const ct = res.headers.get('content-type') || '';
//       if (ct.includes('application/problem+json')) {
//         const problem = await res.json();
//
//         if (problem.errors && typeof problem.errors === 'object') {
//           Object.entries(problem.errors).forEach(([field, msgs]) => {
//             const first = Array.isArray(msgs) ? msgs[0] : String(msgs);
//             const el =
//               form.querySelector(`#${field}`) ||
//               form.querySelector(`.${field}-input`);
//             if (el) setFieldError(el, first);
//           });
//         }
//
//         alert(problem.title || 'Failed to send. Please check the form.');
//       } else {
//         const text = await res.text();
//         alert(`Send failed (${res.status}). ${text}`);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Network error. Please try again.');
//     } finally {
//       submitButton.disabled = false;
//       submitButton.textContent = prevText || 'Send';
//     }
//   });
// }
//
// window.initProjects = initProjects;
function initProjects() {
  const API_URL = '/api/feedback/client';
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  const emailInput   = form.querySelector('#newsletter-email');
  const submitButton = form.querySelector('button[type="submit"]');

  const setFieldError = (inputEl, message) => {
    const field = inputEl?.closest?.('.form-field');
    if (!field) return;
    const msg = field.querySelector('.form-error-message');
    field.classList.toggle('form-field--error', !!message);
    if (msg) msg.textContent = message || '';
  };
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||'').trim());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (emailInput?.value || '').trim();
    if (!validEmail(email)) {
      setFieldError(emailInput, 'Please enter a valid email');
      return;
    }
    setFieldError(emailInput, '');

    // ✅ Always send a name even if the UI has no name field
    // Use a neutral default to pass strict name validators
    const name = 'Newsletter Subscriber';

    const payload = {
      name,                    // IMPORTANT: required by your API
      email,
      description: 'This client is interested in planned projects',
      source: 'Planned Projects section - Main page',
    };

    submitButton.disabled = true;
    const prev = submitButton.textContent;
    submitButton.textContent = 'Sending…';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        alert('Thanks! Your message has been sent.');
        return;
      }

      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/problem+json')) {
        const problem = await res.json();
        console.warn('ProblemDetails:', problem); // 👈 see exact server errors in console
        const errors = problem.errors || {};
        // Surface any field-specific errors
        for (const [field, msgs] of Object.entries(errors)) {
          const el = form.querySelector(`#${field}`) || form.querySelector(`.${field}-input`);
          if (el) setFieldError(el, Array.isArray(msgs) ? msgs[0] : String(msgs));
        }
        alert(problem.title || 'Validation failed. Please check the form.');
      } else {
        const text = await res.text();
        alert(`Send failed (${res.status}). ${text}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = prev || 'Follow';
    }
  });
}

window.initProjects = initProjects;
