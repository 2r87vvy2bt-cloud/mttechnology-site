function goToConsultations() {
  const isIndex = checkPath()

  if (isIndex) {
    const consultations = document.querySelector('.tech');
    consultations.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } else {
    localStorage.setItem('dest', 'tech');
    window.location.href = '/index.html#tech';
  }
}

function goToPrices() {
  const isIndex = checkPath()

  if (isIndex) {
    const consultations = document.querySelector('.metal-price__content');
    consultations.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  } else {
    localStorage.setItem('dest', 'metal-price__content');
    window.location.href = '/index.html#metal-price__content';
  }
}


function goToProjects() {
  const isIndex = checkPath()

  if (isIndex) {
    const consultations = document.querySelector('.projects');
    consultations.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } else {
    localStorage.setItem('dest', 'projects');
    window.location.href = '/index.html#projects';
  }
}

function checkPath(){
  const path = window.location.pathname;
  const isIndex =
    path === '/' ||
    path.endsWith('/index.html') ||
    path.endsWith('/index');

  if (isIndex) {
    const consultations = document.querySelector('.tech');
    consultations.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  } else {
    localStorage.setItem('dest', 'tech');
    window.location.href = '/index.html#tech';
  }
  return isIndex;
}