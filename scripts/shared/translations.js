;(function (window) {
  const translations = {
    en: {
      buttons: {
        productsBtn: 'Buy / Sell Products',
        consultationsBtn: 'Free Consultation',
        personalConsultBtn: 'Personal Consultation',
        catalogBtn: 'Full Catalog',
        allowBtn: 'Allow',
        denyBtn: 'Deny',
        privacyBtn: 'Privacy Policy',
        homeBtn: 'Home',
        servicesBtn: 'All Services',
        projectsBtn: 'New Projects Soon',
        pricesBtn: 'Exchange Prices',
        blogBtn: 'Blog',
        contactsBtn: 'Contacts',
        partnerBtn: 'Become a Partner',
        toBlogBtn: 'Go to Blog',
        interestingBtn: 'Interesting?',
        followBtn: 'Follow',
        chatBtn: 'Start a new Chat',
        sendBtn: 'Send',
        scrollUpBtn: 'Scroll Up',
        buyBtn: 'Buy Products',
        orderBtn: 'Order Service',
        sellBtn: 'Sell Products',
        searchBtn: 'Search',
        feedbackBtn: 'Contact Us',
        detailsBtn: 'More Details',
        backBtn: 'Back',
      },
      privacy: {
        titleOrd: 'PRIVACY',
        titleBlue: 'POLICY',
        subtitle: 'Your privacy is important to us. We respect your privacy regarding any information we may collect from you on our website.',
        sections: [
          { title: 'Information provided by the user:', text: 'The user provides the following information: first name, last name, email address, date of birth, and contact phone number.' },
          { title: 'Information collected automatically:', text: 'When visiting the website, the following data is automatically collected: IP address, browser type, and operating system of the user.' },
          { title: 'Information obtained from third parties:', text: 'We may also receive personal data from third parties, such as delivery services, to process orders and ensure product delivery.' },
          { title: 'Purposes of information collection:', text: 'The collected information is used solely for processing orders, providing feedback to users, improving website functionality, and delivering personalized services.' },
          { title: 'Data storage:', text: 'We strictly adhere to data protection laws and store users\' personal information securely. Data is retained only for as long as necessary to achieve the purposes for which it was collected.' },
          { title: 'Disclosure of data to third parties:', text: 'We do not disclose users\' personal data to third parties without their consent, except as required by law.' },
          { title: 'Cookies:', text: 'Our website may use cookies to enhance user experience and analyze user behavior. Users can manage cookie settings in their browser.' },
          { title: 'Changes to the privacy policy:', text: 'We reserve the right to make changes to the privacy policy periodically. All changes will be published on this page.' },
          { title: 'Contact information:', text: 'If users have questions or requests regarding the processing of their personal data, they can contact us using the contact information provided on the website.' },
        ],
      },
      form: {
        namePlaceholder: 'Enter name',
        emailPlaceholder: 'Enter email',
        phonePlaceholder: 'Enter phone number',
        descriptionPlaceholder: 'Enter description (Optional)',
        policyPlaceholder: 'Do you agree with our ',
        nameLabel: 'Name',
        emailLabel: 'Email',
        phoneLabel: 'Phone number',
        descriptionLabel: 'Description (Optional)',
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email',
        phoneInvalid: 'Please enter a valid phone number',
        policyRequired: 'Please agree with our Privacy Policy',
        sending: 'Sending…',
      },
      placingOrder: {
        titleOrd: 'PLACING AN',
        titleBlue: 'ORDER',
        subtitle: 'Read the description of the raw materials and fill out the form',
      },
      footer: {
        terms: 'Terms',
        privacy: 'Privacy',
        cookies: 'Cookies',
      },
      cookie: {
        titleBlue: 'COOKIES',
        titleOrd: 'MAY WE USE ',
        content: 'With your permission we\'ll \nadd two Google Analytics \ncookies to improve our basic \ntraffic analysis.',
      },
      introduction: {
        titleBlue: 'SMART',
        titleOrd: 'METAL SOURCING',
        subtitle: 'We create solutions — you focus on results',

        slides: {
          slide0: 'Engineering services',
          slide1: 'Recycling',
          slide2: 'Exchange prices',
          slide3: 'Upcoming projects',
        },
        imageContent: {
          first: 'WE BUY TITANIUM SHAVE',
          second: '{years}+ YEARS ON MARKET',
          third: 'ALL RAW MATERIAL LICENSES',
          fourth: '50+ BUSINESS PARTNERS',
        },
      },
      metalPrices: {
        nonFerrous: {
          titleBlue: 'NON-FERROUS',
          titleOrd: 'METALS',
        },
        ferroalloy: {
          titleBlue: 'FERROALLOY',
          titleOrd: 'MATERIALS',
        },
        precious: {
          titleBlue: 'PRECIOUS',
          titleOrd: 'MATERIALS',
        },
        subtitle: 'Last traded 3-month prices, 15 minutes delayed / USD',
        region: 'Europa',
        metals: {
          // Цветные металлы
          aluminium: 'aluminium',
          copper: 'copper',
          lead: 'lead',
          nickel: 'nickel',
          tin: 'tin',
          zinc: 'zinc',

          // Ферросплавы
          ferromanganese: 'ferromanganese',
          silicomanganese: 'silicomanganese',
          ferrosilicon: 'ferrosilicon',
          ferrochrome: 'ferrochrome',
          ferrovanadium: 'ferrovanadium',
          ferrotitanium: 'ferrotitanium',
          ferrotungsten: 'ferrotungsten',
          ferromolybdenum: 'ferromolybdenum',
          ferroniobium: 'ferroniobium',

          // Драгоценные металлы
          gold: 'gold',
          silver: 'silver',
          platinum: 'platinum',
          palladium: 'palladium',
          rhodium: 'rhodium',
        },
      },
      personalConsultations: {
        titleBlue: 'PERSONAL',
        titleOrd: 'CONSULTATION WITH THE FOUNDER',
        subtitle: 'Please get to know me and contact me if you have any questions',

        left: {
          titleBlue: '24/7',
          titleOrd: 'CONSULTATIONS',
          content: 'Personal consultation 24/7 with each of you. Leave a request for a call with you. Manager\'s name is Rene Wells',
        },

        right: {
          titleBlue: ' MY TECHNOLOGY',
          titleOrd: 'HISTORY OF',
          content: 'MT Technology began its journey in 2018, founded by a passionate entrepreneur with a vision for sustainable resource management. Based in Bulgaria, the company specializes in the sale and procurement of raw materials, catering to various industries. In addition to trading, MT Technology offers essential services such as cargo delivery, ensuring that clients receive their materials efficiently and reliably. With a commitment to sustainability and innovation, MT Technology has quickly established itself as a leader in the raw materials sector',
        },

      },
      catalog: {
        titleOrd: 'CATALOG OF',
        component:{
          metals:{
            titleBlue: 'RAW METALS',
            subtitle: 'View the entire catalog of raw materials with a convenient filter for buying or selling',
          },
          services:{
            titleBlue: 'ENGINEERING SERVICES',
            subtitle:'View the entire catalog of engineering services'
          }
        },
        page: {
          titleBlueBuy: 'SUPPLIES ',
          titleBlueSell: 'PROCUREMENT ',
          titleOrdBuy: 'RAW MATERIAL ',
          titleOrdSell: 'RAW MATERIAL ',
          titleOrdPlus: 'FROM MT TECHNOLOGY',
          subtitle: 'All materials comply with EN and ASTM requirements, supplied with a full set of certificates and documents. To receive a commercial offer, please fill out the form on the website and our manager will promptly prepare a calculation',
        },
      },
      service: {
        titleOrd: 'FROM MT TECHNOLOGY',
        titleBlue: 'ENGINEERING SERVICES ',
        subtitle: 'Engineering is the heart of MT Technology. We develop and implement high-tech solutions We cooperate with European research institutes, integrating the best global practices. Each project is taken "turnkey" - from the concept to the launch of pilot industrial samples',
      },
      global: {
        titleBlue: ' GLOBAL DEALS',
        titleOrd: 'FROM LOCAL STEEL TO',
        subtitle: 'European offices opening soon to power your growth',
      },
      blog: {
        section: {
          titleBlue: ' BLOG',
          titleOrd: 'OUR UNIQUE',
          subtitle: 'Open the article you are interested in to study it in more detail',
        },
        page: {
          titleOrd: 'PUBLICATIONS',
          new: {
            titleBlue: 'NEW',
            subtitle: 'Open the article you are interested in to study it in more detail',
          },

          all: {
            titleBlue: 'ALL',
            subtitle: 'If you haven\'t found what you need, you can use the search by tags',
          },
        },
        filter: {
          btn: 'Filter by tags',
          title: 'Filter by tags',
        },
      },
      projects: {
        titleBlue: 'PLANNED',
        titleOrd: 'PROJECTS (2027-2029)',
        subtitle: 'Both projects are being implemented within the framework of innovative solutions support programs and are planned to be launched in 2027. We invite investors and partners to work together!',

        panel: {
          title: '1. Solar panel reception and recycling line',
          subtitle: 'Development of technology for dismantling, sorting and recovery of semiconductor silicon from waste modules',
          list: [
            'Pilot hydromechanical separation plant',
            'Scaling and integration with recycling operators',
            'Analysis of solar cell composition and their degradation',
          ],
        },

        redox: {
          title: '2. Recycling of Nickel Iron Phosphate Batteries (NFPB)',
          subtitle: 'Project for processing and recovery of active materials from spent nickel iron phosphate battery cells',
          list: [
            'Mechanical disassembly and sorting of battery components',
            'Extraction of nickel, iron, and phosphate compounds',
            'Development of safe methods for disposal of electrolytes and housings',
          ],
        },

        sub: {
          title: '3. Subscribe so you don\'t miss anything',
          subtitle: 'There will also be other projects, subscribe so as not to miss them or even become our partner',
        },
      },
      faq: {
        titleBlue: ' FAQ',
        titleOrd: 'FIND ANSWERS TO',
        subtitle: 'Got Questions? We\'ve Got Answers!',

        questions: [
          'How to cooperate with MT Technology?',
          'What is the limit for the sale of raw materials?',
          'How to become a permanent partner?',
        ],

        answers: [
          'We’re always here to connect. You can reach us via [email], phone, or through the contact form.',
          'Tell us what you need, and we’ll build a custom offer.',
          'Long-term collaboration starts with one step. We welcome forward-thinking companies to join our partner program.',
        ],


      },
      tech: {
        titleBlue: ' 24/7',
        titleOrd: 'WE ARE ALWAYS WITH YOU',
        subtitle: 'Please fill out this form or send us an email',
        items: [
          {
            title: 'Email',
            subtitle: 'Our friendly team is here to help',
          },
          {
            title: 'Phone',
            subtitle: 'Mon-Fri from 8:00 AM to 7:00 PM',
          },
          {
            title: 'Online Chat',
            subtitle: 'Have questions? Contact us for assistance',
          },
        ],
      },
    },

    ru: {
      buttons: {
        productsBtn: 'Куп. / Прод. товар',
        consultationsBtn: 'Бесп. консультация',
        personalConsultBtn: 'Личная консультация',
        catalogBtn: 'Полный каталог',
        allowBtn: 'Разрешить',
        denyBtn: 'Отклонить',
        privacyBtn: 'Политика конфиденциальности',
        homeBtn: 'Главная',
        servicesBtn: 'Все услуги',
        projectsBtn: 'Скоро новые проекты',
        pricesBtn: 'Биржевые цены',
        blogBtn: 'Блог',
        contactsBtn: 'Контакты',
        partnerBtn: 'Стать партнёром',
        toBlogBtn: 'В блог',
        interestingBtn: 'Интересно?',
        followBtn: 'Подписаться',
        chatBtn: 'Начать новый чат',
        sendBtn: 'Отправить',
        scrollUpBtn: 'Наверх',
        buyBtn: 'Купить',
        sellBtn: 'Продать',
        orderBtn: 'Заказать услугу',
        searchBtn: 'Поиск',
        feedbackBtn: 'Связаться',
        detailsBtn: 'Подробнее',
        backBtn: 'Назад',
      },
      privacy: {
        titleOrd: 'ПОЛИТИКА',
        titleBlue: 'КОНФИДЕНЦИАЛЬНОСТИ',
        subtitle: 'Ваша конфиденциальность важна для нас. Мы уважаем вашу конфиденциальность в отношении любой информации, которую можем собирать на нашем сайте.',
        sections: [
          { title: 'Информация, предоставленная пользователем:', text: 'Пользователь предоставляет следующую информацию: имя, фамилию, адрес электронной почты, дату рождения и контактный номер телефона.' },
          { title: 'Информация, собираемая автоматически:', text: 'При посещении сайта автоматически собираются следующие данные: IP-адрес, тип браузера и операционная система пользователя.' },
          { title: 'Информация, полученная от третьих лиц:', text: 'Мы также можем получать персональные данные от третьих лиц, например от служб доставки, для обработки заказов и обеспечения доставки товаров.' },
          { title: 'Цели сбора информации:', text: 'Собранная информация используется исключительно для обработки заказов, предоставления обратной связи пользователям, улучшения функциональности сайта и предоставления персонализированных услуг.' },
          { title: 'Хранение данных:', text: 'Мы строго соблюдаем законодательство о защите данных и надёжно храним персональную информацию пользователей. Данные хранятся только столько, сколько необходимо для достижения целей, для которых они были собраны.' },
          { title: 'Раскрытие данных третьим лицам:', text: 'Мы не раскрываем персональные данные пользователей третьим лицам без их согласия, за исключением случаев, предусмотренных законодательством.' },
          { title: 'Файлы cookie:', text: 'Наш сайт может использовать файлы cookie для улучшения пользовательского опыта и анализа поведения посетителей. Пользователи могут управлять настройками cookie в своём браузере.' },
          { title: 'Изменения политики конфиденциальности:', text: 'Мы оставляем за собой право периодически вносить изменения в политику конфиденциальности. Все изменения будут опубликованы на этой странице.' },
          { title: 'Контактная информация:', text: 'Если у пользователей есть вопросы или запросы относительно обработки их персональных данных, они могут связаться с нами, используя контактную информацию, указанную на сайте.' },
        ],
      },
      form: {
        namePlaceholder: 'Введите имя',
        emailPlaceholder: 'Введите e-mail',
        phonePlaceholder: 'Введите номер телефона',
        descriptionPlaceholder: 'Введите описание (необязательно)',
        policyPlaceholder: 'Вы согласны с нашей ',
        nameLabel: 'Имя',
        emailLabel: 'Электронная почта',
        phoneLabel: 'Номер телефона',
        descriptionLabel: 'Описание (необязательно)',
        nameRequired: 'Укажите имя',
        emailRequired: 'Укажите электронную почту',
        emailInvalid: 'Введите корректный адрес электронной почты',
        phoneInvalid: 'Введите корректный номер телефона',
        policyRequired: 'Пожалуйста, примите условия политики конфиденциальности',
        sending: 'Отправка…',
      },
      placingOrder: {
        titleOrd: 'ОФОРМЛЕНИЕ',
        titleBlue: 'ЗАКАЗА',
        subtitle: 'Ознакомьтесь с описанием сырья и заполните форму',
      },
      footer: {
        terms: 'Условия',
        privacy: 'Конфиденциальность',
        cookies: 'Куки',
      },
      cookie: {
        titleBlue: ' COOKIES',
        titleOrd: 'РАЗРЕШИТЬ',
        content: 'С вашего разрешения мы добавим\nдва cookie Google Analytics,\nчтобы улучшить базовую\nаналитику трафика.',
      },
      introduction: {
        titleBlue: 'УМНАЯ',
        titleOrd: 'ЗАКУПКА МЕТАЛЛОВ',
        subtitle: 'Мы создаём решения — вы сосредотачиваетесь на результате',
        slides: {
          slide0: 'Инжиниринговые услуги',
          slide1: 'Переработка',
          slide2: 'Биржевые цены',
          slide3: 'Скоро новые проекты',
        },
        imageContent: {
          first: 'ПОКУПАЕМ ТИТАНОВУЮ СТРУЖКУ',
          second: '{years}+ ЛЕТ НА РЫНКЕ',
          third: 'ВСЕ ЛИЦЕНЗИИ НА КАЖДЫЙ ВИД СЫРЬЯ',
          fourth: '50+ БИЗНЕС-ПАРТНЁРОВ',
        },
      },
      metalPrices: {
        nonFerrous: {
          titleBlue: 'ЦВЕТНЫЕ',
          titleOrd: 'МЕТАЛЛЫ',
        },
        ferroalloy: {
          titleBlue: 'ФЕРРОСПЛАВЫ',
          titleOrd: 'МАТЕРИАЛЫ',
        },
        precious: {
          titleBlue: 'ДРАГОЦЕННЫЕ',
          titleOrd: 'МЕТАЛЛЫ',
        },
        subtitle: 'Последние цены по 3-месячным контрактам, задержка 15 минут / USD',
        region: 'Европа',
        metals: {
          aluminium: 'алюминий',
          copper: 'медь',
          lead: 'свинец',
          nickel: 'никель',
          tin: 'олово',
          zinc: 'цинк',
          ferromanganese: 'ферромарганец',
          silicomanganese: 'силикомарганец',
          ferrosilicon: 'ферросилиций',
          ferrochrome: 'феррохром',
          ferrovanadium: 'феррованадий',
          ferrotitanium: 'ферротитан',
          ferrotungsten: 'ферровольфрам',
          ferromolybdenum: 'ферромолибден',
          ferroniobium: 'феррониобий',
          gold: 'золото',
          silver: 'серебро',
          platinum: 'платина',
          palladium: 'палладий',
          rhodium: 'родий',
        },
      },
      personalConsultations: {
        titleBlue: 'ЛИЧНАЯ',
        titleOrd: 'КОНСУЛЬТАЦИЯ С ОСНОВАТЕЛЕМ',
        subtitle: 'Пожалуйста, познакомьтесь и пишите по любым вопросам',
        left: {
          titleBlue: '24/7',
          titleOrd: 'КОНСУЛЬТАЦИИ',
          content: 'Личная консультация 24/7 для каждого. Оставьте заявку на звонок. Имя менеджера — Рене Уэллс.',
        },
        right: {
          titleBlue: 'MT TECHNOLOGY',
          titleOrd: 'ИСТОРИЯ',
          content: 'MT Technology начала путь в 2018 году. Компания, базирующаяся в Болгарии, занимается продажей и закупкой сырья для различных отраслей, а также предоставляет услуги по доставке грузов. С фокусом на устойчивость и инновации MT Technology быстро зарекомендовала себя как надёжный партнёр в сырьевом секторе.',
        },
      },
      catalog: {
        titleOrd: 'КАТАЛОГ ',
        components: {
          metals: {
            titleBlue: 'МЕТАЛЛОВ',
            subtitle: 'Посмотреть весь каталог сырья с удобным фильтром для покупки или продажи',
          },
          services: {
            titleBlue: 'ИНЖЕНЕРНЫЕ УСЛУГИ',
            subtitle: 'Посмотреть весь каталог инженерных услуг',
          }
        },
        page: {
          titleBlueBuy: 'СЫРЬЯ',
          titleBlueSell: 'СЫРЬЯ ',
          titleOrdBuy: 'ПОСТАВКИ  ',
          titleOrdSell: 'ЗАКУПКА ',
          titleOrdPlus: 'ОТ MT TECHNOLOGY',
          subtitle: 'Все материалы соответствуют стандартам EN и ASTM и поставляются с полным комплектом сертификатов. Чтобы получить коммерческое предложение, заполните форму на сайте — наш менеджер оперативно подготовит расчёт.',
        },

      },
      service: {
        titleOrd: 'ОТ MT TECHNOLOGY',
        titleBlue: 'ИНЖЕНЕРНЫЕ УСЛУГИ ',
        subtitle: 'Инжиниринг — сердце MT Technology. Мы разрабатываем и внедряем высокотехнологичные решения, сотрудничая с европейскими НИИ и внедряя лучшие мировые практики. Каждый проект выполняется «под ключ»: от концепции до запуска пилотных промышленных образцов.',
      },
      global: {
        titleBlue: 'ГЛОБАЛЬНЫЕ СДЕЛКИ',
        titleOrd: 'ОТ МЕСТНОЙ СТАЛИ К',
        subtitle: 'Скоро открываем офисы в Европе, чтобы ускорить ваш рост',
      },
      blog: {
        section: {
          titleBlue: 'БЛОГ',
          titleOrd: 'НАШ УНИКАЛЬНЫЙ',
          subtitle: 'Откройте интересующую статью, чтобы изучить её подробнее',
        },
        page: {
          titleOrd: 'ПУБЛИКАЦИИ',
          new: {
            titleBlue: 'НОВЫЕ',
            subtitle: 'Откройте интересующую статью, чтобы изучить её подробнее.',
          },
          all: {
            titleBlue: 'ВСЕ',
            subtitle: 'Если не нашли нужное — воспользуйтесь поиском по тегам.',
          },
        },
        filter: {
          btn: 'Фильтр по тегам',
          title: 'Фильтр по тегам',
        },
      },
      projects: {
        titleBlue: 'ПЛАНИРУЕМЫЕ',
        titleOrd: 'ПРОЕКТЫ (2027–2029)',
        subtitle: 'Оба проекта реализуются в рамках программ поддержки инноваций и планируются к запуску в 2027 году. Приглашаем инвесторов и партнёров к сотрудничеству!',
        panel: {
          title: '1. Линия приёма и переработки солнечных панелей',
          subtitle: 'Технология демонтажа, сортировки и извлечения полупроводникового кремния из отработанных модулей',
          list: [
            'Пилотная гидромеханическая установка',
            'Масштабирование и интеграция с операторами переработки',
            'Анализ состава солнечных элементов и их деградации',
          ],
        },
        redox: {
          title: '2. Переработка никель-железо-фосфатных аккумуляторов (NFPB)',
          subtitle: 'Проект по переработке и извлечению активных материалов из отработанных никель-железо-фосфатных аккумуляторов',
          list: [
            'Механическая разборка и сортировка компонентов аккумуляторов',
            'Извлечение никеля, железа и фосфатных соединений',
            'Безопасные методы утилизации электролитов и корпусов',
          ],
        },
        sub: {
          title: '3. Подпишитесь, чтобы не пропустить',
          subtitle: 'Будут и другие проекты — подпишитесь, чтобы не пропустить их или стать нашим партнёром',
        },
      },
      faq: {
        titleBlue: 'FAQ',
        titleOrd: 'НАЙДИТЕ ОТВЕТЫ',
        subtitle: 'Есть вопросы? У нас есть ответы!',
        questions: [
          'Как начать сотрудничество с MT Technology?',
          'Каков лимит по продаже сырья?',
          'Как стать постоянным партнёром?',
        ],
        answers: [
          'Мы всегда на связи. Напишите на e-mail, позвоните или заполните контактную форму.',
          'Опишите ваши потребности — мы подготовим индивидуальное предложение.',
          'Долгосрочное сотрудничество начинается с первого шага. Присоединяйтесь к нашей партнёрской программе.',
        ],
      },
      tech: {
        titleBlue: '24/7',
        titleOrd: 'МЫ ВСЕГДА НА СВЯЗИ',
        subtitle: 'Пожалуйста, заполните форму или напишите нам на e-mail',
        items: [
          { title: 'E-mail', subtitle: 'Наша дружелюбная команда поможет' },
          { title: 'Телефон', subtitle: 'Пн–Пт с 8:00 до 19:00' },
          { title: 'Онлайн-чат', subtitle: 'Есть вопросы? Мы на связи' },
        ],
      },
    },

    de: {
      buttons: {
        productsBtn: 'Prod. kauf. / verkauf.',
        consultationsBtn: 'Kostenl. Beratung',
        personalConsultBtn: 'Persönliche Beratung',
        catalogBtn: 'Voller Katalog',
        allowBtn: 'Zulassen',
        denyBtn: 'Ablehnen',
        privacyBtn: 'Datenschutzerklärung',
        homeBtn: 'Startseite',
        servicesBtn: 'Alle Leistungen',
        projectsBtn: 'Neue Projekte demnächst',
        pricesBtn: 'Börsenpreise',
        blogBtn: 'Blog',
        contactsBtn: 'Kontakt',
        partnerBtn: 'Partner werden',
        toBlogBtn: 'Zum Blog',
        interestingBtn: 'Interessant?',
        followBtn: 'Folgen',
        chatBtn: 'Neuen Chat starten',
        sendBtn: 'Senden',
        scrollUpBtn: 'Nach oben',
        buyBtn: 'Kaufen',
        sellBtn: 'Verkaufen',
        orderBtn: 'Bestellservice',
        searchBtn: 'Suchen',
        feedbackBtn: 'Kontakt',
        detailsBtn: 'Weitere Details',
        backBtn: 'Zurück',
      },
      privacy: {
        titleOrd: 'DATENSCHUTZ-',
        titleBlue: 'RICHTLINIE',
        subtitle: 'Ihre Privatsphäre ist uns wichtig. Wir respektieren Ihre Privatsphäre in Bezug auf alle Informationen, die wir auf unserer Website von Ihnen erheben können.',
        sections: [
          { title: 'Vom Nutzer bereitgestellte Informationen:', text: 'Der Nutzer stellt folgende Informationen bereit: Vorname, Nachname, E-Mail-Adresse, Geburtsdatum und Kontakttelefonnummer.' },
          { title: 'Automatisch erhobene Informationen:', text: 'Beim Besuch der Website werden folgende Daten automatisch erfasst: IP-Adresse, Browsertyp und Betriebssystem des Nutzers.' },
          { title: 'Informationen von Dritten:', text: 'Wir können auch personenbezogene Daten von Dritten, wie z. B. Lieferdiensten, erhalten, um Bestellungen zu bearbeiten und die Produktlieferung sicherzustellen.' },
          { title: 'Zwecke der Informationserhebung:', text: 'Die erhobenen Informationen werden ausschließlich zur Bearbeitung von Bestellungen, zur Rückmeldung an Nutzer, zur Verbesserung der Website-Funktionalität und zur Bereitstellung personalisierter Dienstleistungen verwendet.' },
          { title: 'Datenspeicherung:', text: 'Wir halten uns streng an die Datenschutzgesetze und speichern die persönlichen Informationen der Nutzer sicher. Die Daten werden nur so lange aufbewahrt, wie es zur Erreichung der Zwecke, für die sie erhoben wurden, erforderlich ist.' },
          { title: 'Weitergabe von Daten an Dritte:', text: 'Wir geben personenbezogene Daten der Nutzer nicht ohne deren Zustimmung an Dritte weiter, außer wenn dies gesetzlich vorgeschrieben ist.' },
          { title: 'Cookies:', text: 'Unsere Website kann Cookies verwenden, um die Nutzererfahrung zu verbessern und das Nutzerverhalten zu analysieren. Nutzer können die Cookie-Einstellungen in ihrem Browser verwalten.' },
          { title: 'Änderungen der Datenschutzrichtlinie:', text: 'Wir behalten uns das Recht vor, die Datenschutzrichtlinie regelmäßig zu ändern. Alle Änderungen werden auf dieser Seite veröffentlicht.' },
          { title: 'Kontaktinformationen:', text: 'Wenn Nutzer Fragen oder Anfragen zur Verarbeitung ihrer personenbezogenen Daten haben, können sie uns über die auf der Website angegebenen Kontaktdaten erreichen.' },
        ],
      },
      form: {
        namePlaceholder: 'Name eingeben',
        emailPlaceholder: 'E-Mail eingeben',
        phonePlaceholder: 'Telefonnummer eingeben',
        descriptionPlaceholder: 'Beschreibung eingeben (optional)',
        policyPlaceholder: 'Sind Sie mit unserer ',
        nameLabel: 'Name',
        emailLabel: 'E-Mail-Adresse',
        phoneLabel: 'Telefonnummer',
        descriptionLabel: 'Beschreibung (optional)',
        nameRequired: 'Bitte geben Sie Ihren Namen ein',
        emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
        emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        phoneInvalid: 'Bitte geben Sie eine gültige Telefonnummer ein',
        policyRequired: 'Bitte stimmen Sie unserer Datenschutzrichtlinie zu',
        sending: 'Wird gesendet…',
      },
      placingOrder: {
        titleOrd: 'BESTELLUNG',
        titleBlue: 'AUFGEBEN',
        subtitle: 'Lesen Sie die Beschreibung der Rohstoffe und füllen Sie das Formular aus',
      },
      footer: {
        terms: 'Nutzungsbedingungen',
        privacy: 'Datenschutz',
        cookies: 'Cookies',
      },
      cookie: {
        titleBlue: ' COOKIES',
        titleOrd: 'DÜRFEN WIR',
        content: 'Mit Ihrer Erlaubnis fügen wir zwei\nGoogle-Analytics-Cookies hinzu, \num unseregrundlegende Traffic-Analyse \nzu verbessern.',
      },
      introduction: {
        titleBlue: 'SMART',
        titleOrd: 'METALLBESCHAFFUNG',
        subtitle: 'Wir entwickeln Lösungen – Sie konzentrieren sich auf Ergebnisse.',
        slides: {
          slide0: 'Ingenieurdienstleistungen',
          slide1: 'Recycling',
          slide2: 'Börsenpreise',
          slide3: 'Bevorstehende Projekte',
        },
        imageContent: {
          first: 'WIR KAUFEN TITANSPÄNE',
          second: '{years}+ JAHRE AM MARKT',
          third: 'ALLE LIZENZEN FÜR JEDE ROHSTOFFART',
          fourth: '50+ GESCHÄFTSPARTNER',
        },
      },
      metalPrices: {
        nonFerrous: {
          titleBlue: 'UNEDLE',
          titleOrd: 'METALLE',
        },
        ferroalloy: {
          titleBlue: 'FERROLEGIERUNGEN',
          titleOrd: 'MATERIALIEN',
        },
        precious: {
          titleBlue: 'Edle',
          titleOrd: 'MATERIALIEN',
        },
        subtitle: 'Zuletzt gehandelte 3-Monats-Preise, 15 Minuten Verzögerung / USD',
        region: 'Europa',
        metals: {
          aluminium: 'Aluminium',
          copper: 'Kupfer',
          lead: 'Blei',
          nickel: 'Nickel',
          tin: 'Zinn',
          zinc: 'Zink',
          ferromanganese: 'Ferromangan',
          silicomanganese: 'Siliziummangan',
          ferrosilicon: 'Ferrosilizium',
          ferrochrome: 'Ferrochrom',
          ferrovanadium: 'Ferrovanadium',
          ferrotitanium: 'Ferrotitan',
          ferrotungsten: 'Ferrotungsten',
          ferromolybdenum: 'Ferromolybdän',
          ferroniobium: 'Ferroniob',
          gold: 'Gold',
          silver: 'Silber',
          platinum: 'Platin',
          palladium: 'Palladium',
          rhodium: 'Rhodium',
        },
      },
      personalConsultations: {
        titleBlue: 'PERSÖNLICHE',
        titleOrd: 'BERATUNG MIT DEM GRÜNDER',
        subtitle: 'Lernen Sie mich kennen und kontaktieren Sie mich bei Fragen',
        left: {
          titleBlue: '24/7',
          titleOrd: 'BERATUNGEN',
          content: 'Persönliche Beratung rund um die Uhr. Hinterlassen Sie eine Rückrufanfrage. Zuständiger Manager: Rene Wells.',
        },
        right: {
          titleBlue: 'MT TECHNOLOGY',
          titleOrd: 'GESCHICHTE',
          content: 'MT Technology wurde 2018 gegründet. Mit Sitz in Bulgarien spezialisiert sich das Unternehmen auf den Handel und die Beschaffung von Rohstoffen und bietet zusätzlich zuverlässige Frachtdienstleistungen. Mit Fokus auf Nachhaltigkeit und Innovation hat sich MT Technology schnell als verlässlicher Partner im Rohstoffsektor etabliert.',
        },
      },
      catalog: {
        titleOrd: 'KATALOG VON',
        component: {
          metals: {
            titleBlue: 'ROHMETALLE',
            subtitle: 'Den gesamten Katalog der Rohstoffe mit praktischem Filter zum Kaufen oder Verkaufen ansehen',
          },
          services: {
            titleBlue: 'INGENIEURDIENSTLEISTUNGEN',
            subtitle: 'Den gesamten Katalog der Ingenieurdienstleistungen ansehen',
          }
        },
        page: {
          titleBlueBuy: 'LIEFERUNGEN ',
          titleBlueSell: 'BESCHAFFUNG ',
          titleOrdBuy: 'VON ROHSTOFFEN ',
          titleOrdSell: 'VON ROHSTOFFEN ',
          titleOrdPlus: 'VON MT TECHNOLOGY',
          subtitle: 'Alle Materialien erfüllen EN- und ASTM-Vorgaben und werden mit vollständigen Zertifikaten geliefert. Für ein Angebot füllen Sie bitte das Formular aus – unser Team erstellt zeitnah eine Kalkulation.',
        },
      },
      service: {
        titleOrd: 'VON MT TECHNOLOGY',
        titleBlue: 'INGENIEURS-\nDIENSTLEISTUNGEN ',
        subtitle: 'Engineering ist das Herz von MT Technology. Wir entwickeln und implementieren High-Tech-Lösungen, arbeiten mit europäischen Forschungsinstituten zusammen und integrieren Best Practices. Jedes Projekt ist „schlüsselfertig“ – vom Konzept bis zu industriellen Pilotmustern.',
      },
      global: {
        titleBlue: 'GLOBALE GESCHÄFTE',
        titleOrd: 'VON LOKALEM STAHL ZU',
        subtitle: 'Europäische Büros eröffnen bald, um Ihr Wachstum zu unterstützen',
      },
      blog: {
        section: {
          titleBlue: 'BLOG',
          titleOrd: 'UNSER EINZIGARTIGER',
          subtitle: 'Öffnen Sie den interessierenden Artikel, um ihn genauer zu lesen',
        },
        page: {
          titleOrd: 'VERÖFFENT-\nLICHUNGEN',
          new: {
            titleBlue: 'NEU',
            subtitle: 'Öffnen Sie den Artikel, der Sie interessiert, um mehr zu erfahren.',
          },
          all: {
            titleBlue: 'ALLE',
            subtitle: 'Nicht fündig geworden? Nutzen Sie die Tag-Suche.',
          },
        },
        filter: {
          btn: 'Nach Tags filtern',
          title: 'Nach Tags filtern',
        },
      },
      projects: {
        titleBlue: 'GEPLANTE',
        titleOrd: 'PROJEKTE (2027–2029)',
        subtitle: 'Beide Projekte werden im Rahmen von Programmen zur Förderung innovativer Lösungen umgesetzt und sind für 2027 geplant. Wir laden Investoren und Partner zur Zusammenarbeit ein!',
        panel: {
          title: '1. Annahme- und Recyclinglinie für Solarmodule',
          subtitle: 'Technologie zur Demontage, Sortierung und Rückgewinnung von Halbleiter-Silizium aus Altmodulen',
          list: [
            'Pilotanlage für hydromechanische Trennung',
            'Skalierung und Integration mit Recyclingbetreibern',
            'Analyse der Zellzusammensetzung und Degradation',
          ],
        },
        redox: {
          title: '2. Recycling von Nickel-Eisen-Phosphat-Batterien (NFPB)',
          subtitle: 'Projekt zur Verarbeitung und Rückgewinnung aktiver Materialien aus verbrauchten Nickel-Eisen-Phosphat-Batteriezellen',
          list: [
            'Mechanische Demontage und Sortierung der Batteriekomponenten',
            'Extraktion von Nickel, Eisen und Phosphatverbindungen',
            'Sichere Methoden zur Entsorgung von Elektrolyten und Gehäusen',
          ],
        },
        sub: {
          title: '3. Abonnieren, um nichts zu verpassen',
          subtitle: 'Weitere Projekte folgen – abonnieren Sie, um nichts zu verpassen oder unser Partner zu werden',
        },
      },
      faq: {
        titleBlue: 'FAQ',
        titleOrd: 'FINDEN SIE ANTWORTEN',
        subtitle: 'Haben Sie Fragen? Wir haben Antworten!',
        questions: [
          'Wie kann man mit MT Technology zusammenarbeiten?',
          'Gibt es ein Limit für den Verkauf von Rohstoffen?',
          'Wie wird man dauerhafter Partner?',
        ],
        answers: [
          'Wir sind jederzeit erreichbar – per E-Mail, Telefon oder Kontaktformular.',
          'Sagen Sie uns, was Sie brauchen, und wir erstellen ein maßgeschneidertes Angebot.',
          'Langfristige Partnerschaften beginnen mit einem ersten Schritt. Treten Sie unserem Partnerprogramm bei.',
        ],
      },
      tech: {
        titleBlue: '24/7',
        titleOrd: 'WIR SIND IMMER FÜR SIE DA',
        subtitle: 'Bitte füllen Sie dieses Formular aus oder senden Sie uns eine E-Mail',
        items: [
          { title: 'E-Mail', subtitle: 'Unser freundliches Team hilft gern' },
          { title: 'Telefon', subtitle: 'Mo–Fr, 8:00–19:00' },
          { title: 'Online-Chat', subtitle: 'Fragen? Kontaktieren Sie uns' },
        ],
      },
    },

    bg: {
      buttons: {
        productsBtn: 'Купи / Продай',
        consultationsBtn: 'Безпл. консултация',
        personalConsultBtn: 'Лична консултация',
        catalogBtn: 'Пълен каталог',
        allowBtn: 'Разреши',
        denyBtn: 'Откажи',
        privacyBtn: 'Политика за поверителност',
        homeBtn: 'Начало',
        servicesBtn: 'Всички услуги',
        projectsBtn: 'Нови проекти скоро',
        pricesBtn: 'Борсови цени',
        blogBtn: 'Блог',
        contactsBtn: 'Контакти',
        partnerBtn: 'Стани партньор',
        toBlogBtn: 'Към блога',
        interestingBtn: 'Интересно?',
        followBtn: 'Абонирай се',
        chatBtn: 'Започни нов чат',
        sendBtn: 'Изпрати',
        scrollUpBtn: 'Нагоре',
        buyBtn: 'Купи продукти',
        orderBtn: 'Поръчай услуга',
        sellBtn: 'Продай продукти',
        searchBtn: 'Търсене',
        feedbackBtn: 'Свържете се с нас',
        detailsBtn: 'Повече подробности',
        backBtn: 'Назад',
      },
      privacy: {
        titleOrd: 'ПОЛИТИКА ЗА',
        titleBlue: 'ПОВЕРИТЕЛНОСТ',
        subtitle: 'Вашата поверителност е важна за нас. Ние уважаваме поверителността ви по отношение на всяка информация, която можем да събираме чрез нашия уебсайт.',
        sections: [
          { title: 'Информация, предоставена от потребителя:', text: 'Потребителят предоставя следната информация: име, фамилия, имейл адрес, дата на раждане и телефон за контакт.' },
          { title: 'Информация, събирана автоматично:', text: 'При посещение на уебсайта автоматично се събират следните данни: IP адрес, тип браузър и операционна система на потребителя.' },
          { title: 'Информация, получена от трети страни:', text: 'Можем също да получаваме лични данни от трети страни, например доставчици на логистични услуги, за обработка на поръчки и осигуряване на доставка на продукти.' },
          { title: 'Цели на събирането на информация:', text: 'Събраната информация се използва единствено за обработка на поръчки, обратна връзка с потребителите, подобряване на функционалността на сайта и предоставяне на персонализирани услуги.' },
          { title: 'Съхранение на данни:', text: 'Спазваме стриктно законодателството за защита на данните и съхраняваме личната информация на потребителите по сигурен начин. Данните се пазят само толкова дълго, колкото е необходимо за целите, за които са събрани.' },
          { title: 'Разкриване на данни пред трети страни:', text: 'Не разкриваме лични данни на потребителите пред трети страни без тяхното съгласие, освен когато това се изисква от закона.' },
          { title: 'Бисквитки:', text: 'Нашият уебсайт може да използва бисквитки за подобряване на потребителското изживяване и анализ на поведението на посетителите. Потребителите могат да управляват настройките за бисквитки в своя браузър.' },
          { title: 'Промени в политиката за поверителност:', text: 'Запазваме си правото периодично да променяме политиката за поверителност. Всички промени ще бъдат публикувани на тази страница.' },
          { title: 'Информация за контакт:', text: 'Ако потребителите имат въпроси или искания относно обработването на личните им данни, могат да се свържат с нас чрез посочените на сайта контакти.' },
        ],
      },
      form: {
        namePlaceholder: 'Въведете име',
        emailPlaceholder: 'Въведете имейл',
        phonePlaceholder: 'Въведете телефонен номер',
        descriptionPlaceholder: 'Въведете описание (по избор)',
        policyPlaceholder: 'Съгласни ли сте с нашата ',
        nameLabel: 'Име',
        emailLabel: 'Имейл',
        phoneLabel: 'Телефонен номер',
        descriptionLabel: 'Описание (по избор)',
        nameRequired: 'Името е задължително',
        emailRequired: 'Имейлът е задължителен',
        emailInvalid: 'Моля, въведете валиден имейл',
        phoneInvalid: 'Моля, въведете валиден телефонен номер',
        policyRequired: 'Моля, съгласете се с нашата Политика за поверителност',
        sending: 'Изпращане…',
      },
      placingOrder: {
        titleOrd: 'ПОДАВАНЕ НА',
        titleBlue: 'ЗАЯВКА',
        subtitle: 'Запознайте се с описанието на суровините и попълнете формата',
      },
      footer: {
        terms: 'Условия',
        privacy: 'Поверителност',
        cookies: 'Бисквитки',
      },
      cookie: {
        titleBlue: 'БИСКВИТКИ',
        titleOrd: 'МОЖЕМ ЛИ ДА ИЗПОЛЗВАМЕ ',
        content: 'С ваше разрешение ще добавим\nдве бисквитки на Google Analytics,\nза да подобрим базовия\nанализ на трафика.',
      },
      introduction: {
        titleBlue: 'ИНТЕЛИГЕНТНО',
        titleOrd: 'СНАБДЯВАНЕ С МЕТАЛИ',
        subtitle: 'Ние създаваме решения — вие се фокусирате върху резултатите',
        slides: {
          slide0: 'Инженерни услуги',
          slide1: 'Рециклиране',
          slide2: 'Борсови цени',
          slide3: 'Предстоящи проекти',
        },
        imageContent: {
          first: 'ИЗКУПУВАМЕ ТИТАНОВИ СТРУЖКИ',
          second: '{years}+ ГОДИНИ НА ПАЗАРА',
          third: 'ВСИЧКИ ЛИЦЕНЗИ ЗА СУРОВИНИ',
          fourth: '50+ БИЗНЕС ПАРТНЬОРИ',
        },
      },
      metalPrices: {
        nonFerrous: { titleBlue: 'ЦВЕТНИ', titleOrd: 'МЕТАЛИ' },
        ferroalloy: { titleBlue: 'ФЕРОСПЛАВНИ', titleOrd: 'МАТЕРИАЛИ' },
        precious: { titleBlue: 'БЛАГОРОДНИ', titleOrd: 'МЕТАЛИ' },
        subtitle: 'Последни 3-месечни търгувани цени, със закъснение 15 минути / USD',
        region: 'Европа',
        metals: {
          aluminium: 'алуминий', copper: 'мед', lead: 'олово', nickel: 'никел', tin: 'калай', zinc: 'цинк',
          ferromanganese: 'фероманган', silicomanganese: 'силикоманган', ferrosilicon: 'феросилиций', ferrochrome: 'ферохром', ferrovanadium: 'ферованадий', ferrotitanium: 'феротитан', ferrotungsten: 'фероволфрам', ferromolybdenum: 'феромолибден', ferroniobium: 'ферониобий',
          gold: 'злато', silver: 'сребро', platinum: 'платина', palladium: 'паладий', rhodium: 'родий',
        },
      },
      personalConsultations: {
        titleBlue: 'ЛИЧНА',
        titleOrd: 'КОНСУЛТАЦИЯ С ОСНОВАТЕЛЯ',
        subtitle: 'Запознайте се с мен и се свържете при въпроси',
        left: {
          titleBlue: '24/7',
          titleOrd: 'КОНСУЛТАЦИИ',
          content: 'Лична консултация 24/7 за всеки от вас. Оставете заявка за обратно обаждане. Вашият мениджър е Rene Wells',
        },
        right: {
          titleBlue: ' MT TECHNOLOGY',
          titleOrd: 'ИСТОРИЯ НА',
          content: 'MT Technology започва своя път през 2018 г., основана от предприемач с ясна визия за устойчиво управление на ресурсите. Базирана в България, компанията е специализирана в продажбата и изкупуването на суровини за различни индустрии. Освен търговия, MT Technology предлага и ключови услуги като товарна доставка, за да получават клиентите материалите си ефективно и надеждно. С фокус върху устойчивостта и иновациите MT Technology бързо се утвърди като надежден партньор в сектора на суровините',
        },
      },
      catalog: {
        titleOrd: 'КАТАЛОГ НА',
        component:{
          metals:{ titleBlue: 'СУРОВИ МЕТАЛИ', subtitle: 'Разгледайте пълния каталог със суровини с удобен филтър за покупка или продажба' },
          services:{ titleBlue: 'ИНЖЕНЕРНИ УСЛУГИ', subtitle:'Разгледайте пълния каталог с инженерни услуги' }
        },
        page: {
          titleBlueBuy: 'ДОСТАВКИ ',
          titleBlueSell: 'ИЗКУПУВАНЕ ',
          titleOrdBuy: 'НА СУРОВИНИ ',
          titleOrdSell: 'НА СУРОВИНИ ',
          titleOrdPlus: 'ОТ MT TECHNOLOGY',
          subtitle: 'Всички материали отговарят на изискванията на EN и ASTM и се доставят с пълен комплект сертификати и документи. За да получите търговско предложение, попълнете формата на сайта и нашият мениджър бързо ще подготви калкулация',
        },
      },
      service: {
        titleOrd: 'ОТ MT TECHNOLOGY',
        titleBlue: 'ИНЖЕНЕРНИ УСЛУГИ ',
        subtitle: 'Инженерингът е сърцето на MT Technology. Разработваме и внедряваме високотехнологични решения, работим с европейски научноизследователски институти и интегрираме най-добрите световни практики. Всеки проект се изпълнява „до ключ“ - от концепцията до пускането на пилотни промишлени образци',
      },
      global: {
        titleBlue: ' ГЛОБАЛНИ СДЕЛКИ',
        titleOrd: 'ОТ ЛОКАЛНА СТОМАНА КЪМ',
        subtitle: 'Скоро откриваме европейски офиси, за да подкрепим вашия растеж',
      },
      blog: {
        section: { titleBlue: ' БЛОГ', titleOrd: 'НАШИЯТ УНИКАЛЕН', subtitle: 'Отворете статията, която ви интересува, за да я разгледате по-подробно' },
        page: {
          titleOrd: 'ПУБЛИКАЦИИ',
          new: { titleBlue: 'НОВИ', subtitle: 'Отворете статията, която ви интересува, за да я разгледате по-подробно' },
          all: { titleBlue: 'ВСИЧКИ', subtitle: 'Ако не сте намерили това, което търсите, можете да използвате търсенето по тагове' },
        },
        filter: {
          btn: 'Филтриране по тагове',
          title: 'Филтриране по тагове',
        },
      },
      projects: {
        titleBlue: 'ПЛАНИРАНИ',
        titleOrd: 'ПРОЕКТИ (2027-2029)',
        subtitle: 'И двата проекта се реализират в рамките на програми за подкрепа на иновативни решения и се планира да стартират през 2027 г. Каним инвеститори и партньори за съвместна работа!',
        panel: {
          title: '1. Линия за приемане и рециклиране на соларни панели',
          subtitle: 'Разработване на технология за демонтаж, сортиране и възстановяване на полупроводников силиций от отпадъчни модули',
          list: ['Пилотна инсталация за хидромеханично разделяне', 'Мащабиране и интеграция с оператори за рециклиране', 'Анализ на състава на соларните клетки и тяхната деградация'],
        },
        redox: {
          title: '2. Рециклиране на никел-желязо-фосфатни батерии (NFPB)',
          subtitle: 'Проект за обработка и възстановяване на активни материали от отработени никел-желязо-фосфатни батерийни клетки',
          list: ['Механично разглобяване и сортиране на компонентите на батериите', 'Извличане на никел, желязо и фосфатни съединения', 'Разработване на безопасни методи за обезвреждане на електролити и корпуси'],
        },
        sub: {
          title: '3. Абонирайте се, за да не пропуснете нищо',
          subtitle: 'Ще има и други проекти - абонирайте се, за да не ги пропуснете или дори да станете наш партньор',
        },
      },
      faq: {
        titleBlue: ' FAQ',
        titleOrd: 'НАМЕРЕТЕ ОТГОВОРИ НА',
        subtitle: 'Имате въпроси? Имаме отговори!',
        questions: ['Как да си сътрудничите с MT Technology?', 'Какъв е лимитът за продажба на суровини?', 'Как да станете постоянен партньор?'],
        answers: ['Винаги сме на разположение за връзка. Можете да се свържете с нас по имейл, телефон или чрез контактната форма.', 'Кажете ни от какво имате нужда и ще подготвим индивидуална оферта.', 'Дългосрочното сътрудничество започва с първата стъпка. Каним далновидни компании да се присъединят към нашата партньорска програма.'],
      },
      tech: {
        titleBlue: ' 24/7',
        titleOrd: 'ВИНАГИ СМЕ ДО ВАС',
        subtitle: 'Моля, попълнете тази форма или ни изпратете имейл',
        items: [
          { title: 'Имейл', subtitle: 'Нашият екип е готов да помогне' },
          { title: 'Телефон', subtitle: 'Пон-Пет от 8:00 до 19:00' },
          { title: 'Онлайн чат', subtitle: 'Имате въпроси? Свържете се с нас за съдействие' },
        ],
      },
    },
  };

  const SUPPORTED_LANGS = ['en', 'ru', 'de', 'bg'];
  const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
  const defaultLang = SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'en';
  const lang = localStorage.getItem('lang') || defaultLang;

  function getNested(obj, path) {
    return path.split('.').reduce((o, key) => (o && o[key] != null) ? o[key] : null, obj);
  }

  const FOUNDED_YEAR = 2018;

  function applyTranslations() {
    const dict = translations[lang] || translations.en;
    const yearsOnMarket = new Date().getFullYear() - FOUNDED_YEAR;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = getNested(dict, key);
      if (text) el.textContent = text.replace('{years}', yearsOnMarket);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = getNested(dict, key);
      if (text) el.placeholder = text;
    });
  }

  window.translations = translations;
  window.applyTranslations = applyTranslations;
  window.currentLang = lang;
})(window);
