const translations = {
  en: {
    chain: {
      title: 'What is the strongest metal? - \nTheir types and applications',
      description:
        'Metals have always played a significant role in the \ndevelopment of the material culture of human society. Tod...',
    },
    copperMark: {
      title: 'The Copper Mark: Driving \nResponsible Mineral Production',
      description:
        'The Copper Mark highlights responsible production practices in copper, molybdenum, nickel, and zinc, showcasing...',
    },
    copperArbitrage: {
      title: 'Copper Market Arbitrage: \nWhen Global and Regional',
      description:
        'Copper is traded on multiple global and regional exchanges, offering traders opportunities to take advantage of...',
    },
    copperAluminiumSubstitution: {
      title: 'Copper Shortage Drives \nFaster Aluminium Adoption',
      description:
        'Rising copper prices and supply constraints are accelerating the use of aluminium as a substitute in industrial...',
    },
    cobaltAlloyContractExtension: {
      title: 'Cobalt Alloy Acquisition \nContract Extended in the US',
      description:
        'The US government has extended a contract opportunity to acquire alloy-grade cobalt, aiming to secure supply for...',
    },
    rareEarthMetalExpansion: {
      title:
        'New Rare Earth Facility Planned \nin France to Strengthen',
      description:
        'A UK-based rare earth metal producer is investing €110 million to build a new facility in Southern France, aiming...',
    },
    euBulkAlloysSafeguarding: {
      title:
        'Three Potential Safeguarding \nScenarios Facing EU Bulk',
      description:
        'The European Commission (EC) is investigating possible safeguards for the EU bulk ferro-alloys market, considering...',
    },
  },

  ru: {
    chain: {
      title: 'Какой металл самый прочный? -\nИх виды и применение',
      description:
        'Металлы всегда играли важную роль в \nразвитии материальной культуры человеческого общества. Сегодня...',
    },
    copperMark: {
      title: 'The Copper Mark: Движущая сила \nответственного производства',
      description:
        'Инициатива Copper Mark подчёркивает ответственные практики производства меди, молибдена, никеля и цинка, демонстрируя...',
    },
    copperArbitrage: {
      title: 'Арбитраж на рынке меди: \nвзаимодействие цен',
      description:
        'Медь торгуется на нескольких глобальных и региональных биржах, что открывает трейдерам возможности...',
    },
    copperAluminiumSubstitution: {
      title: 'Дефицит меди ускоряет переход на алюминий',
      description:
        'Рост цен на медь и ограничения предложения ускоряют замену на алюминий в промышленности — особенно в...',
    },
    cobaltAlloyContractExtension: {
      title:
        'В США продлено окно заявок на контракт по закупке кобальта',
      description:
        'Правительство США продлило возможность подачи предложений на поставку сплавного кобальта для...',
    },
    rareEarthMetalExpansion: {
      title:
        'Во Франции планируется новый завод РЗМ для укрепления цепочки поставок',
      description:
        'Британский производитель редкоземельных металлов инвестирует €110 млн в строительство предприятия...',
    },
    euBulkAlloysSafeguarding: {
      title:
        'Сценарии защитни на рынке массовых ферросплавов ЕС',
      description:
        'Еврокомиссия рассматривает защитные меры для рынка массовых ферросплавов ЕС: минимальные импортные...',
    },
  },

  de: {
    chain: {
      title: 'Was ist das stärkste Metall? - \nIhre Arten und Anwendungen',
      description:
        'Metalle haben immer eine bedeutende Rolle in der \nEntwicklung der materiellen Kultur der menschlichen Gesellschaft gespielt. Heutzutage...',
    },
    copperMark: {
      title:
        'The Copper Mark: Verantwortungsvoll produzieren',
      description:
        'Der Copper Mark hebt verantwortungsvolle Produktionspraktiken bei Kupfer, Molybdän, Nickel und Zink hervor und zeigt das Engagement der Branche für Nachhaltigkeit und...',
    },
    copperArbitrage: {
      title: 'Kupfer-Arbitrage: Wenn globale \nund regionale Preise interagieren',
      description:
        'Kupfer wird auf mehreren globalen und regionalen Börsen gehandelt. So ergeben sich Chancen, Preisunterschiede zwischen internationalen und inländischen Märkten...',
    },
    copperAluminiumSubstitution: {
      title: 'Kupfermangel beschleunigt den Einsatz von Aluminium',
      description:
        'Steigende Kupferpreise und Angebotsengpässe beschleunigen die Substitution durch Aluminium — insbesondere in HVAC-Systemen und ...',
    },
    cobaltAlloyContractExtension: {
      title:
        'USA verlängern Ausschreibung für Kobalt in Legierungsqualität',
      description:
        'Die US-Regierung hat die Frist für Angebote zur Lieferung von Kobalt in Legierungsqualität verlängert, um die Versorgung für Luft- und Raumfahrt sowie...',
    },
    rareEarthMetalExpansion: {
      title:
        'Neues Werk für Seltene Erden in Frankreich',
      description:
        'Ein britischer Produzent investiert 110 Mio. € in eine Anlage in Südfrankreich, um Europas Lieferkette für Seltene Erden auszubauen und Branchen wie...',
    },
    euBulkAlloysSafeguarding: {
      title:
        'Drei mögliche Schutzszenarien für den EU-Markt',
      description:
        'Die EU-Kommission prüft Schutzmaßnahmen für den EU-Markt massenhafter Ferrolegierungen, darunter Mindestimportpreise, Zollkontingente oder endgültige...',
    },
  },
};

const SUPPORTED_LANGS = ['en', 'ru', 'de'];
const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
const defaultLang = SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'en';
const lang = localStorage.getItem('lang') || defaultLang;
const t = translations[lang] || translations.en;

export const items = [
  {
    image: '../../public/images/blog/chain.png',
    title: t.chain.title,
    tags: ['#New', '#Info', '#Metal', '#Steel', '#Chain'],
    description: t.chain.description,
    time: '7 min',
    views: 13392,
    date: '2025.09.8',
    action: 'View more Details',
    id: 'chain',
  },
  {
    image: '../../public/images/blog/copper-mark.png',
    title: t.copperMark.title,
    tags: ['#Copper', '#ESG', '#Sustainability', '#EnergyTransition'],
    description: t.copperMark.description,
    time: '9 min',
    views: 8451,
    date: '2025.09.10',
    action: 'View more Details',
    id: 'copperMark',
  },
  {
    image: '../../public/images/blog/copper-arbitrage.jpg',
    title: t.copperArbitrage.title,
    tags: ['#Copper', '#Arbitrage', '#Markets'],
    description: t.copperArbitrage.description,
    time: '8 min',
    views: 5623,
    date: '2025.09.22',
    action: 'View more Details',
    id: 'copperArbitrage',
  },
  {
    image: '../../public/images/blog/aluminium.png',
    title: t.copperAluminiumSubstitution.title,
    tags: ['#Copper', '#Aluminium', '#HVAC', '#EVs'],
    description: t.copperAluminiumSubstitution.description,
    time: '8 min',
    views: 4970,
    date: '2025.10.06',
    action: 'View more Details',
    id: 'copperAluminiumSubstitution',
  },
  {
    image: '../../public/images/blog/cobalt.png',
    title: t.cobaltAlloyContractExtension.title,
    tags: ['#Cobalt', '#Aerospace', '#Defense'],
    description: t.cobaltAlloyContractExtension.description,
    time: '6 min',
    views: 3210,
    date: '2025.10.20',
    action: 'View more Details',
    id: 'cobaltAlloyContractExtension',
  },
  {
    image: '../../public/images/blog/rare-earths.png',
    title: t.rareEarthMetalExpansion.title,
    tags: ['#RareEarths', '#France', '#SupplyChain'],
    description: t.rareEarthMetalExpansion.description,
    time: '7 min',
    views: 4122,
    date: '2025.11.3',
    action: 'View more Details',
    id: 'rareEarthMetalExpansion',
  },
  {
    image: '../../public/images/blog/eu-alloys.png',
    title: t.euBulkAlloysSafeguarding.title,
    tags: ['#EU', '#FerroAlloys', '#Policy'],
    description: t.euBulkAlloysSafeguarding.description,
    time: '10 min',
    views: 3899,
    date: '2025.11.17',
    action: 'View more Details',
    id: 'euBulkAlloysSafeguarding',
  },
];
