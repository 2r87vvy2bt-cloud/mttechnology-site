function initNonFerrous() {
  const metalsId = ['aluminium', 'copper', 'zinc', 'nickel', 'lead', 'tin'];

  const grid = document.getElementById('non-ferrous');
  grid.innerHTML = '';

  metalsId.forEach((metalKey) => {
    fetch(`/api/prices/get_price?id=${metalKey}`)
      .then(response => response.json())
      .then(json => {
        const { id, price, change, typeOfPrice } = json;
        const isLbs = /lbs/i.test(typeOfPrice);
        const displayPrice = isLbs ? price * 2204.62 : price;
        const displayUnit = isLbs ? 'USD/T' : typeOfPrice;
        const isPositive = change >= 0;

        const card = document.createElement('div');
        card.className = 'metal-card';

        const nameEl = document.createElement('p');
        nameEl.textContent = id.charAt(0).toUpperCase() + id.slice(1);
        card.appendChild(nameEl);

        const priceCon = document.createElement('div');
        priceCon.className = 'metal-card__price';

        const amount = document.createElement('span');
        amount.className = 'amount';
        amount.textContent = `$${Math.round(displayPrice).toLocaleString('en-US')}`;

        const changeEl = document.createElement('span');
        changeEl.className = `change ${isPositive ? 'positive' : 'negative'}`;
        const sign = isPositive ? '+' : '−';
        changeEl.textContent = `${sign} ${Math.abs(change).toFixed(2)}%`;

        priceCon.append(amount, changeEl);
        card.appendChild(priceCon);

        const footer = document.createElement('div');
        footer.className = 'metal-card__price__con';

        const label = document.createElement('p');
        label.className = 'label';
        label.textContent = 'Price Type';

        const expiryEl = document.createElement('p');
        expiryEl.className = 'expiry';
        expiryEl.textContent = displayUnit;

        footer.append(label, expiryEl);
        card.appendChild(footer);

        grid.appendChild(card);
      })
      .catch(err => console.error(`Error fetching ${metalKey}:`, err));
  });

  const prevBtn = document.getElementById('nf-prev');
  const nextBtn = document.getElementById('nf-next');
  const scrollAmt = grid.clientWidth;

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: scrollAmt, behavior: 'smooth' });
  });
}

function initFerroalloy() {
  const metalsId = [
    'ferrochrome',
    "ferrochrome",
    "ferromanganese",
    "ferromolybdenum",
    "ferrosilicon",
    "ferrotitanium",
    "ferrotungsten",
    "ferrovanadium",
    "silicomanganese",
    "ferroniobium"
  ];

  metalsTitle = [
    'Ferrochrome',
    "Ferrochrome",
    "Ferromanganese",
    "Ferromolybdenum",
    "Ferrosilicon",
    "Ferrotitanium",
    "Ferrotungsten",
    "Ferrovanadium",
    "Silicomanganese",
    "Ferroniobium"
  ]

  const grid = document.getElementById('ferroalloy');
  grid.innerHTML = '';

  metalsId.forEach((metalKey, i) => {
    fetch(`/api/prices/get_price?id=${metalKey}`)
      .then(response => response.json())
      .then(json => {
        const { id, price, change, typeOfPrice } = json;
        const isPositive = change >= 0;

        const card = document.createElement('div');
        card.className = 'metal-card';

        const nameEl = document.createElement('p');
        nameEl.textContent = metalsTitle[i];
        card.appendChild(nameEl);

        const priceCon = document.createElement('div');
        priceCon.className = 'metal-card__price';

        const amount = document.createElement('span');
        amount.className = 'amount';
        amount.textContent = `$${price.toFixed(2)}`;

        const changeEl = document.createElement('span');
        changeEl.className = `change ${isPositive ? 'positive' : 'negative'}`;
        const sign = isPositive ? '+' : '−';
        changeEl.textContent = `${sign} ${Math.abs(change).toFixed(2)}%`;

        priceCon.append(amount, changeEl);
        card.appendChild(priceCon);

        const footer = document.createElement('div');
        footer.className = 'metal-card__price__con';

        const label = document.createElement('p');
        label.className = 'label';
        label.textContent = 'Price Type';

        const expiryEl = document.createElement('p');
        expiryEl.className = 'expiry';
        expiryEl.textContent = typeOfPrice;

        footer.append(label, expiryEl);
        card.appendChild(footer);

        grid.appendChild(card);
      })
      .catch(err => console.error(`Error fetching ${metalKey}:`, err));
  });

  const prevBtn = document.getElementById('fer-prev');
  const nextBtn = document.getElementById('fer-next');
  const scrollAmt = grid.clientWidth;

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: scrollAmt, behavior: 'smooth' });
  });
}

function initPrecious() {
  const metalsId = [
    'gold',
    'silver',
    'platinum',
    'palladium',
    'rhodium',
  ];

  const grid = document.getElementById('precious');
  grid.innerHTML = '';

  metalsId.forEach((metalKey) => {
    fetch(`/api/prices/get_price?id=${metalKey}`)
      .then(response => response.json())
      .then(json => {
        const { id, price, change, typeOfPrice } = json;
        const isPositive = change >= 0;

        const card = document.createElement('div');
        card.className = 'metal-card';

        const nameEl = document.createElement('p');
        nameEl.textContent = id.charAt(0).toUpperCase() + id.slice(1);
        card.appendChild(nameEl);

        const priceCon = document.createElement('div');
        priceCon.className = 'metal-card__price';

        const amount = document.createElement('span');
        amount.className = 'amount';
        amount.textContent = `$${price.toFixed(2)}`;

        const changeEl = document.createElement('span');
        changeEl.className = `change ${isPositive ? 'positive' : 'negative'}`;
        const sign = isPositive ? '+' : '−';
        changeEl.textContent = `${sign} ${Math.abs(change).toFixed(2)}%`;

        priceCon.append(amount, changeEl);
        card.appendChild(priceCon);

        const footer = document.createElement('div');
        footer.className = 'metal-card__price__con';

        const label = document.createElement('p');
        label.className = 'label';
        label.textContent = 'Price Type';

        const expiryEl = document.createElement('p');
        expiryEl.className = 'expiry';
        expiryEl.textContent = typeOfPrice;

        footer.append(label, expiryEl);
        card.appendChild(footer);

        grid.appendChild(card);
      })
      .catch(err => console.error(`Error fetching ${metalKey}:`, err));
  });

  const prevBtn = document.getElementById('prec-prev');
  const nextBtn = document.getElementById('prec-next');
  const scrollAmt = grid.clientWidth;

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: scrollAmt, behavior: 'smooth' });
  });
}

window.initNonFerrous = initNonFerrous;
window.initFerroalloy = initFerroalloy;
window.initPrecious = initPrecious;
