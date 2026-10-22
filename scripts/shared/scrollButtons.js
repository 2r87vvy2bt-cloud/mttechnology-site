;(function (window) {

  function initScrollButtons() {
    const scroller = document.querySelector('.metal-price__non-ferrous');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');
    const scrollAmount = 200;

    if (!scroller || !btnLeft || !btnRight) return;

    btnLeft.addEventListener('click', () =>
      scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' }),
    );
    btnRight.addEventListener('click', () =>
      scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }),
    );

    function updateButtons() {
      btnLeft.disabled = scroller.scrollLeft === 0;
      btnRight.disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth;
    }

    scroller.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  window.initScrollButtons = initScrollButtons;

})(window);

document.addEventListener('DOMContentLoaded', window.initScrollButtons);
