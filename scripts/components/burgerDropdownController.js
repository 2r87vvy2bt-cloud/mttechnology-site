function initBurgerDropdown() {
  const burgerBtn = document.querySelector('.burger-btn');
  const burgerDropdown = document.querySelector('.burger-dropdown');
  const burgerBtnSprite = document.querySelector('.burger-btn-sprite');

  if (!burgerBtn || !burgerDropdown || !burgerBtnSprite) {
    console.log("null parameter");
    return;
  }

  const closedBrDropdown = '../../public/images/icons/burger-cl.svg';
  const openedBrDropdown = '../../public/images/icons/burger-op.svg';

  let isOpen = false;

  burgerBtn.addEventListener('click', () => {
    burgerDropdown.classList.toggle('open');
    console.log("clicked");

    burgerBtnSprite.src = isOpen
      ? closedBrDropdown
      : openedBrDropdown;

    isOpen = !isOpen;
  });

  const items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      burgerDropdown.classList.toggle('open');
      burgerBtnSprite.src = closedBrDropdown;
    })
  })
}

window.initBurgerDropdown = initBurgerDropdown;