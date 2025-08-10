// src/locales/translations.ts
import type { SupportedLanguage } from "@/store/languageSlice";

export interface Translations {
  // Orders Table
  ordersTable: {
    headers: {
      cargo: string;
      characteristics: string;
      price: string;
      from: string;
      to: string;
      status: string;
      actions: string;
    };
    cargoType: string;
    packaging: string;
    actions: {
      details: string;
    };
    error: {
      title: string;
      message: string;
    };
    empty: {
      title: string;
      message: string;
    };
    summary: string;
    updated: string;
    orders: string;
  };

  // Status texts
  status: {
    readyFrom: string;
    always: string;
    notReady: string;
    statusError: string;
    notSpecified: string;
    active: string;
    inactive: string;
  };

  // Common
  common: {
    notSpecified: string;
    standard: string;
    loading: string;
    error: string;
    noTitle: string;
    kg: string;
    ton: string;
    withVat: string;
    withoutVat: string;
    negotiable: string;
    som: string;
    notDimensioned: string;
    typeLabel: string;
    pricingType: string;
  };

  // Bid types
  bid: {
    offer: string;
    request: string;
  };

  // Header
  header: {
    findCars: string;
    findCargos: string;
    postCar: string;
    postCargo: string;
    profile: string;
    menu: string;
    signOut: string;
    signIn: string;
  };

  // Page titles
  pages: {
    home: string;
    orders: string;
    orderDetails: string;
    trucks: string;
    truckDetails: string;
    profile: string;
    login: string;
    exportersCatalog: string;
    myOrders: string;
    myOrdersSubtitle: string;
    myTrucks: string;
    myTrucksSubtitle: string;
  };

  // My Orders/Trucks specific
  myItems: {
    orders: {
      title: string;
      subtitle: string;
      emptyTitle: string;
      emptyMessage: string;
      postFirst: string;
      yourOrders: string;
      postNew: string;
    };
    trucks: {
      title: string;
      subtitle: string;
      emptyTitle: string;
      emptyMessage: string;
      postFirst: string;
      yourTrucks: string;
      postNew: string;
    };
    actions: {
      edit: string;
      delete: string;
      activate: string;
      deactivate: string;
      confirmDelete: string;
    };
  };

  // Exporters Catalog
  exportersCatalog: {
    title: string;
    subtitle: string;
    search: {
      placeholder: string;
      byCompany: string;
      byCountry: string;
      byActivity: string;
      byGoods: string;
      searchButton: string;
      clearFilters: string;
    };
    table: {
      headers: {
        company: string;
        tin: string;
        activity: string;
        goods: string;
        capacity: string;
        representative: string;
        country: string;
        contacts: string;
        actions: string;
      };
      viewProfile: string;
      sendMessage: string;
      callNow: string;
      emailNow: string;
    };
    filters: {
      allCountries: string;
      allActivities: string;
      allGoods: string;
    };
    empty: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
  };

  filterCargo: {
    location: {
      pickupLocation: string;
      pickupPlaceholder: string;
      deliveryLocation: string;
      deliveryPlaceholder: string;
    };
    cargoDetails: {
      weight: string;
      weightPlaceholder: string;
      price: string;
      pricePlaceholder: string;
    };
  };

  filterTrucks: {
    location: {
      pickupLocation: string;
      pickupPlaceholder: string;
      deliveryLocation: string;
      deliveryPlaceholder: string;
    };
    truckDetails: {
      weight: string;
      weightPlaceholder: string;
      price: string;
      pricePlaceholder: string;
    };
  };

  // Post Cargo Page
  postCargo: {
    title: string;
    subtitle: string;
    back: string;
    steps: {
      cargoDetails: string;
      locations: string;
      truckRequirements: string;
      pricingTimeline: string;
    };
    cargoDetails: {
      title: string;
      cargoName: string;
      cargoNamePlaceholder: string;
      loadType: string;
      loadTypePlaceholder: string;
      packageType: string;
      packageTypePlaceholder: string;
      weight: string;
      weightPlaceholder: string;
      volume: string;
      volumePlaceholder: string;
      dimensions: string;
      dimensionsLength: string;
      dimensionsWidth: string;
      dimensionsHeight: string;
      pricingMethod: string;
      askForQuote: string;
      acceptBids: string;
    };
    locations: {
      title: string;
      pickupLocation: string;
      deliveryLocation: string;
      pickupPlaceholder: string;
      deliveryPlaceholder: string;
      cargoAvailability: string;
      alwaysAvailable: string;
      alwaysAvailableDesc: string;
      readyFromDate: string;
      readyFromDateDesc: string;
      notReady: string;
      notReadyDesc: string;
      readyFromLabel: string;
      frequency: string;
      frequencyPlaceholder: string;
    };
    truckRequirements: {
      title: string;
      requiredFeatures: string;
      loadingMethods: string;
      unloadingMethods: string;
      gpsMonitoring: string;
      requireGps: string;
      gpsProviderPlaceholder: string;
    };
    pricing: {
      title: string;
      budgetExcludingVat: string;
      budgetIncludingVat: string;
      cashPayment: string;
      pricingMethod: string;
      pricingMethodPlaceholder: string;
      paymentTerms: string;
      paymentTermsPlaceholder: string;
      immediatePayment: string;
      days: string;
    };
    summary: {
      title: string;
      cargo: string;
      weight: string;
      route: string;
      truckOptions: string;
      selected: string;
      budget: string;
    };
    intervals: {
      everyDay: string;
      workingDays: string;
      everyWeek: string;
      twiceAWeek: string;
      everyMonth: string;
    };
    navigation: {
      previous: string;
      continue: string;
      posting: string;
      postCargo: string;
    };
    validation: {
      selectAddresses: string;
      createOrderFailed: string;
      createOrderSuccess: string;
    };
  };

  // Post Truck Page
  postTruck: {
    title: string;
    subtitle: string;
    steps: {
      truckDetails: string;
      specifications: string;
      routesAvailability: string;
      pricingTerms: string;
    };
    truckDetails: {
      title: string;
      truckNumber: string;
      truckNumberPlaceholder: string;
      truckType: string;
      truckTypePlaceholder: string;
      trailerType: string;
      loadCapacity: string;
      loadCapacityPlaceholder: string;
      volume: string;
      volumePlaceholder: string;
      supportedLoadingMethods: string;
    };
    specifications: {
      title: string;
      truckDimensions: string;
      trailerDimensions: string;
      lengthPlaceholder: string;
      widthPlaceholder: string;
      heightPlaceholder: string;
      specialFeatures: string;
      tailgate: string;
      hydraulicLift: string;
      safetyCones: string;
      gpsMonitoring: string;
      gpsAvailable: string;
      gpsProviderPlaceholder: string;
    };
    routes: {
      title: string;
      startingLocation: string;
      destinationLocation: string;
      startingPlaceholder: string;
      destinationPlaceholder: string;
      serviceRadius: string;
      truckAvailability: string;
      alwaysAvailable: string;
      alwaysAvailableDesc: string;
      availableFromDate: string;
      availableFromDateDesc: string;
      availableFromLabel: string;
      readyFrom: string;
      frequency: string;
      frequencyPlaceholder: string;
    };
    pricing: {
      title: string;
      pricingMethod: string;
      askForQuote: string;
      acceptBids: string;
      rateExcludingVat: string;
      rateIncludingVat: string;
      cashRate: string;
      pricingMethodSelect: string;
      pricingMethodPlaceholder: string;
    };
    summary: {
      title: string;
      truckNumber: string;
      capacity: string;
      volume: string;
      route: string;
      loadTypes: string;
      selected: string;
      rate: string;
      any: string;
    };
    trailerTypes: {
      truck: string;
      trailer: string;
      semiTrailer: string;
    };
    intervals: {
      everyDay: string;
      twiceAWeek: string;
      everyWeek: string;
      everyMonth: string;
      often: string;
      contractBased: string;
      workingDays: string;
    };
    navigation: {
      previous: string;
      continue: string;
      posting: string;
      postTruck: string;
    };
    validation: {
      createTruckFailed: string;
      createTruckSuccess: string;
    };
  };

  // Detailed Truck Page
  detailedTruck: {
    notFound: string;
    notFoundDesc: string;
    backToTrucks: string;
    back: string;
    basicInfo: string;
    specifications: string;
    routesAvailability: string;
    pricing: string;
    ownerInfo: string;
    contact: string;
    radius: string;
    fromLocation: string;
    toLocation: string;
    availability: string;
    frequency: string;
    gpsEnabled: string;
    gpsNotAvailable: string;
    cashPayment: string;
    acceptsBids: string;
    fixedPrice: string;
    legalEntity: string;
    individual: string;
    memberSince: string;
    callOwner: string;
    sendMessage: string;
  };
}

// Русские переводы
export const ruTranslations: Translations = {
  ordersTable: {
    headers: {
      cargo: "Груз",
      characteristics: "Характеристики",
      price: "Цена",
      from: "Откуда",
      to: "Куда",
      status: "Статус",
      actions: "Действия",
    },
    cargoType: "Тип груза:",
    packaging: "Упаковка:",
    actions: {
      details: "Подробнее",
    },
    error: {
      title: "Ошибка загрузки заказов",
      message:
        "Не удалось загрузить список заказов. Попробуйте обновить страницу.",
    },
    empty: {
      title: "Нет заказов",
      message: "Заказы появятся здесь, когда они будут созданы.",
    },
    summary: "Показано",
    updated: "Обновлено только что",
    orders: "заказов",
  },
  status: {
    readyFrom: "Готов с",
    always: "Всегда готов",
    notReady: "Не готов",
    statusError: "Ошибка статуса",
    notSpecified: "Статус не указан",
    active: "Активен",
    inactive: "Неактивен",
  },
  common: {
    notSpecified: "Не указано",
    standard: "Стандартная",
    loading: "Загрузка...",
    error: "Ошибка",
    noTitle: "Без названия",
    kg: "кг",
    ton: "т",
    withVat: "с НДС",
    withoutVat: "без НДС",
    negotiable: "Договорная",
    som: "сум",
    notDimensioned: "Не указаны",
    typeLabel: "Тип",
    pricingType: "Тип цены",
  },
  bid: {
    offer: "ПРЕДЛОЖЕНИЕ",
    request: "ЗАПРОС",
  },
  header: {
    findCars: "Найти машины",
    findCargos: "Найти грузы",
    postCar: "Разместить машину",
    postCargo: "Разместить груз",
    menu: "Меню",
    profile: "Профиль",
    signOut: "Выйти",
    signIn: "Войти",
  },
  pages: {
    home: "Главная",
    orders: "Заказы",
    orderDetails: "Детали заказа",
    trucks: "Грузовики",
    truckDetails: "Детали грузовика",
    profile: "Профиль",
    login: "Вход",
    exportersCatalog: "Каталог экспортеров",
    myOrders: "Мои заказы",
    myOrdersSubtitle: "Управление и отслеживание ваших грузовых заказов",
    myTrucks: "Мои грузовики",
    myTrucksSubtitle: "Управление и отслеживание вашего автопарка",
  },
  myItems: {
    orders: {
      title: "Мои грузовые заказы",
      subtitle: "Заказы, созданные вами • Всего: ",
      emptyTitle: "Вы еще не создали ни одного заказа",
      emptyMessage: "Начните с размещения своего первого грузового заказа, чтобы найти перевозчиков.",
      postFirst: "Разместить первый груз",
      yourOrders: "Ваши заказы: ",
      postNew: "Разместить новый груз",
    },
    trucks: {
      title: "Мои грузовики",
      subtitle: "Грузовики, размещенные вами • Всего: ",
      emptyTitle: "Вы еще не разместили ни одного грузовика",
      emptyMessage: "Начните с размещения своего первого грузовика, чтобы связаться с грузовладельцами.",
      postFirst: "Разместить первый грузовик",
      yourTrucks: "Ваши грузовики: ",
      postNew: "Разместить новый грузовик",
    },
    actions: {
      edit: "Редактировать",
      delete: "Удалить",
      activate: "Активировать",
      deactivate: "Деактивировать",
      confirmDelete: "Вы уверены, что хотите удалить это?",
    },
  },
  postCargo: {
    title: "Разместить груз",
    subtitle: "Найдите идеального перевозчика для вашего груза",
    back: "Назад",
    steps: {
      cargoDetails: "Детали груза",
      locations: "Адреса",
      truckRequirements: "Требования к транспорту",
      pricingTimeline: "Цены и сроки",
    },
    cargoDetails: {
      title: "Детали груза",
      cargoName: "Название груза *",
      cargoNamePlaceholder: "Введите описание груза",
      loadType: "Тип груза",
      loadTypePlaceholder: "Выберите тип груза",
      packageType: "Тип упаковки",
      packageTypePlaceholder: "Выберите тип упаковки",
      weight: "Вес *",
      weightPlaceholder: "0",
      volume: "Объем (м³)",
      volumePlaceholder: "0",
      dimensions: "Размеры (Длина × Ширина × Высота)",
      dimensionsLength: "Длина (м)",
      dimensionsWidth: "Ширина (м)",
      dimensionsHeight: "Высота (м)",
      pricingMethod: "Способ формирования цены *",
      askForQuote: "Запросить предложение",
      acceptBids: "Принимать ставки",
    },
    locations: {
      title: "Адреса загрузки и выгрузки",
      pickupLocation: "Место загрузки *",
      deliveryLocation: "Место выгрузки *",
      pickupPlaceholder: "Введите адрес загрузки...",
      deliveryPlaceholder: "Введите адрес выгрузки...",
      cargoAvailability: "Готовность груза",
      alwaysAvailable: "Всегда готов",
      alwaysAvailableDesc: "Готов к отправке в любое время",
      readyFromDate: "Готов с даты",
      readyFromDateDesc: "Доступен с определенной даты",
      notReady: "Не готов",
      notReadyDesc: "Груз еще готовится",
      readyFromLabel: "Готов с даты",
      frequency: "Периодичность",
      frequencyPlaceholder: "Выберите периодичность",
    },
    truckRequirements: {
      title: "Требования к транспорту",
      requiredFeatures: "Необходимые характеристики транспорта *",
      loadingMethods: "Способы загрузки",
      unloadingMethods: "Способы выгрузки",
      gpsMonitoring: "GPS мониторинг",
      requireGps: "Требуется GPS отслеживание для этой перевозки",
      gpsProviderPlaceholder: "Предпочтительный GPS провайдер (опционально)",
    },
    pricing: {
      title: "Цены и условия оплаты",
      budgetExcludingVat: "Бюджет (без НДС)",
      budgetIncludingVat: "Бюджет (с НДС)",
      cashPayment: "Наличный расчет",
      pricingMethod: "Способ расчета",
      pricingMethodPlaceholder: "Выберите способ расчета",
      paymentTerms: "Условия оплаты (дни)",
      paymentTermsPlaceholder: "Выберите условия оплаты",
      immediatePayment: "Немедленная оплата",
      days: "дней",
    },
    summary: {
      title: "Сводка заказа",
      cargo: "Груз:",
      weight: "Вес:",
      route: "Маршрут:",
      truckOptions: "Опции транспорта:",
      selected: "выбрано",
      budget: "Бюджет:",
    },
    intervals: {
      everyDay: "Каждый день",
      workingDays: "Только рабочие дни",
      everyWeek: "Каждую неделю",
      twiceAWeek: "Два раза в неделю",
      everyMonth: "Каждый месяц",
    },
    navigation: {
      previous: "Назад",
      continue: "Продолжить",
      posting: "Размещение...",
      postCargo: "Разместить груз",
    },
    validation: {
      selectAddresses: "Пожалуйста, выберите адреса загрузки и выгрузки",
      createOrderFailed: "Не удалось создать заказ. Попробуйте еще раз.",
      createOrderSuccess: "Груз успешно размещен!",
    },
  },
  postTruck: {
    title: "Разместить грузовик",
    subtitle: "Разместите информацию о своем грузовике и подключитесь к грузовладельцам",
    steps: {
      truckDetails: "Детали грузовика",
      specifications: "Характеристики",
      routesAvailability: "Маршруты и доступность",
      pricingTerms: "Цены и условия",
    },
    truckDetails: {
      title: "Детали грузовика",
      truckNumber: "Номер грузовика",
      truckNumberPlaceholder: "Введите номерной знак грузовика",
      truckType: "Тип грузовика",
      truckTypePlaceholder: "Выберите тип грузовика",
      trailerType: "Тип прицепа",
      loadCapacity: "Грузоподъемность (тонны)",
      loadCapacityPlaceholder: "Введите максимальную грузоподъемность",
      volume: "Объем (м³)",
      volumePlaceholder: "Введите объем грузового отсека",
      supportedLoadingMethods: "Поддерживаемые методы загрузки",
    },
    specifications: {
      title: "Характеристики грузовика",
      truckDimensions: "Размеры грузовика (метры)",
      trailerDimensions: "Размеры прицепа (метры)",
      lengthPlaceholder: "Длина (м)",
      widthPlaceholder: "Ширина (м)",
      heightPlaceholder: "Высота (м)",
      specialFeatures: "Особые функции",
      tailgate: "Задний борт",
      hydraulicLift: "Гидравлический подъемник",
      safetyCones: "Конусы безопасности",
      gpsMonitoring: "GPS-мониторинг",
      gpsAvailable: "GPS-отслеживание доступно для этого грузовика",
      gpsProviderPlaceholder: "Название провайдера GPS (опционально)",
    },
    routes: {
      title: "Маршруты и доступность",
      startingLocation: "Начальная локация",
      destinationLocation: "Локация назначения",
      startingPlaceholder: "Введите начальную локацию...",
      destinationPlaceholder: "Введите локацию назначения...",
      serviceRadius: "Радиус обслуживания (км)",
      truckAvailability: "Доступность грузовика",
      alwaysAvailable: "Всегда доступен",
      alwaysAvailableDesc: "Готов к работе в любое время",
      availableFromDate: "Доступен с даты",
      availableFromDateDesc: "Доступен с определенной даты",
      availableFromLabel: "Доступен с даты",
      readyFrom: "Готов с",
      frequency: "Частота",
      frequencyPlaceholder: "Выберите частоту",
    },
    pricing: {
      title: "Цены и условия",
      pricingMethod: "Метод ценообразования",
      askForQuote: "Запросить предложение",
      acceptBids: "Принимать предложения",
      rateExcludingVat: "Тариф (без НДС)",
      rateIncludingVat: "Тариф (с НДС)",
      cashRate: "Наличный тариф",
      pricingMethodSelect: "Метод ценообразования",
      pricingMethodPlaceholder: "Выберите метод ценообразования",
    },
    summary: {
      title: "Сводка по грузовику",
      truckNumber: "Номер грузовика:",
      capacity: "Грузоподъемность:",
      volume: "Объем:",
      route: "Маршрут:",
      loadTypes: "Типы загрузки:",
      selected: "выбрано",
      rate: "Тариф:",
      any: "Любой",
    },
    trailerTypes: {
      truck: "Грузовик",
      trailer: "Прицеп",
      semiTrailer: "Полуприцеп",
    },
    intervals: {
      everyDay: "Каждый день",
      twiceAWeek: "Два раза в неделю",
      everyWeek: "Каждую неделю",
      everyMonth: "Каждый месяц",
      often: "Часто",
      contractBased: "По договору",
      workingDays: "Только рабочие дни",
    },
    navigation: {
      previous: "Назад",
      continue: "Продолжить",
      posting: "Размещение...",
      postTruck: "Разместить грузовик",
    },
    validation: {
      createTruckFailed: "Не удалось разместить грузовик. Попробуйте еще раз.",
      createTruckSuccess: "Грузовик успешно размещен!",
    },
  },
  detailedTruck: {
    notFound: "Грузовик не найден",
    notFoundDesc: "Грузовик с указанным ID не существует или был удален",
    backToTrucks: "Вернуться к списку грузовиков",
    back: "Назад",
    basicInfo: "Основная информация",
    specifications: "Характеристики",
    routesAvailability: "Маршруты и доступность",
    pricing: "Стоимость",
    ownerInfo: "Информация о владельце",
    contact: "Связаться",
    radius: "Радиус",
    fromLocation: "Откуда",
    toLocation: "Куда",
    availability: "Доступность",
    frequency: "Частота",
    gpsEnabled: "GPS мониторинг доступен",
    gpsNotAvailable: "GPS мониторинг не доступен",
    cashPayment: "Наличные",
    acceptsBids: "Принимает торги",
    fixedPrice: "Фиксированная цена",
    legalEntity: "Юридическое лицо",
    individual: "Физическое лицо",
    memberSince: "Участник с",
    callOwner: "Позвонить владельцу",
    sendMessage: "Отправить сообщение",
  },
  exportersCatalog: {
    title: "Каталог экспортеров",
    subtitle: "Найдите экспортеров и грузовладельцев для сотрудничества",
    search: {
      placeholder: "Поиск по названию компании...",
      byCompany: "По компании",
      byCountry: "По стране",
      byActivity: "По деятельности",
      byGoods: "По товарам",
      searchButton: "Поиск",
      clearFilters: "Очистить фильтры",
    },
    table: {
      headers: {
        company: "Компания",
        tin: "ИНН",
        activity: "Сфера деятельности",
        goods: "Товары",
        capacity: "Годовой объем",
        representative: "Представитель",
        country: "Страна",
        contacts: "Контакты",
        actions: "Действия",
      },
      viewProfile: "Смотреть профиль",
      sendMessage: "Отправить сообщение",
      callNow: "Позвонить",
      emailNow: "Написать",
    },
    filters: {
      allCountries: "Все страны",
      allActivities: "Все сферы",
      allGoods: "Все товары",
    },
    empty: {
      title: "Экспортеры не найдены",
      message: "Попробуйте изменить критерии поиска",
    },
    error: {
      title: "Ошибка загрузки",
      message: "Не удалось загрузить данные экспортеров",
    },
  },
  filterCargo: {
    location: {
      pickupLocation: "Место загрузки",
      pickupPlaceholder: "Введите место загрузки...",
      deliveryLocation: "Место выгрузки",
      deliveryPlaceholder: "Введите место выгрузки...",
    },
    cargoDetails: {
      weight: "Вес (тонны)",
      weightPlaceholder: "0",
      price: "Цена",
      pricePlaceholder: "0",
    },
  },
  filterTrucks: {
    location: {
      pickupLocation: "Место загрузки",
      pickupPlaceholder: "Введите место загрузки...",
      deliveryLocation: "Место выгрузки",
      deliveryPlaceholder: "Введите место выгрузки...",
    },
    truckDetails: {
      weight: "Грузоподъемность (тонны)",
      weightPlaceholder: "0",
      price: "Цена",
      pricePlaceholder: "0",
    },
  },
};

// Английские переводы
export const enTranslations: Translations = {
  ordersTable: {
    headers: {
      cargo: "Cargo",
      characteristics: "Characteristics",
      price: "Price",
      from: "From",
      to: "To",
      status: "Status",
      actions: "Actions",
    },
    cargoType: "Cargo Type:",
    packaging: "Packaging:",
    actions: {
      details: "Details",
    },
    error: {
      title: "Error loading orders",
      message: "Failed to load orders list. Please try refreshing the page.",
    },
    empty: {
      title: "No orders",
      message: "Orders will appear here when they are created.",
    },
    summary: "Showing",
    updated: "Updated just now",
    orders: "orders",
  },
  status: {
    readyFrom: "Ready from",
    always: "Always ready",
    notReady: "Not ready",
    statusError: "Status error",
    notSpecified: "Status not specified",
    active: "Active",
    inactive: "Inactive",
  },
  common: {
    notSpecified: "Not specified",
    standard: "Standard",
    loading: "Loading...",
    error: "Error",
    noTitle: "No title",
    kg: "kg",
    ton: "t",
    withVat: "with VAT",
    withoutVat: "without VAT",
    negotiable: "Negotiable",
    som: "som",
    notDimensioned: "Not specified",
    typeLabel: "Type",
    pricingType: "Pricing Type",
  },
  bid: {
    offer: "OFFER",
    request: "REQUEST",
  },
  header: {
    findCars: "Find Cars",
    findCargos: "Find Cargos",
    postCar: "Post a Car",
    postCargo: "Post a Cargo",
    menu: "Menu",
    profile: "Profile",
    signOut: "Sign Out",
    signIn: "Sign In",
  },
  pages: {
    home: "Home",
    orders: "Orders",
    orderDetails: "Order Details",
    trucks: "Trucks",
    truckDetails: "Truck Details",
    profile: "Profile",
    login: "Login",
    exportersCatalog: "Exporters Catalog",
    myOrders: "My Orders",
    myOrdersSubtitle: "Manage and track your cargo orders",
    myTrucks: "My Trucks",
    myTrucksSubtitle: "Manage and track your truck fleet",
  },
  myItems: {
    orders: {
      title: "My Cargo Orders",
      subtitle: "Orders created by you • Total: ",
      emptyTitle: "You haven't created any orders yet",
      emptyMessage: "Start by posting your first cargo order to find carriers.",
      postFirst: "Post Your First Cargo",
      yourOrders: "Your orders: ",
      postNew: "Post New Cargo",
    },
    trucks: {
      title: "My Trucks",
      subtitle: "Trucks posted by you • Total: ",
      emptyTitle: "You haven't posted any trucks yet",
      emptyMessage: "Start by posting your first truck to connect with cargo owners.",
      postFirst: "Post Your First Truck",
      yourTrucks: "Your trucks: ",
      postNew: "Post New Truck",
    },
    actions: {
      edit: "Edit",
      delete: "Delete",
      activate: "Activate",
      deactivate: "Deactivate",
      confirmDelete: "Are you sure you want to delete this?",
    },
  },
  postCargo: {
    title: "Post a Cargo",
    subtitle: "Find the perfect carrier for your cargo",
    back: "Back",
    steps: {
      cargoDetails: "Cargo Details",
      locations: "Locations",
      truckRequirements: "Truck Requirements",
      pricingTimeline: "Pricing & Timeline",
    },
    cargoDetails: {
      title: "Cargo Details",
      cargoName: "Cargo Name *",
      cargoNamePlaceholder: "Enter cargo description",
      loadType: "Load Type",
      loadTypePlaceholder: "Select load type",
      packageType: "Package Type",
      packageTypePlaceholder: "Select package type",
      weight: "Weight *",
      weightPlaceholder: "0",
      volume: "Volume (m³)",
      volumePlaceholder: "0",
      dimensions: "Dimensions (Length × Width × Height)",
      dimensionsLength: "Length (m)",
      dimensionsWidth: "Width (m)",
      dimensionsHeight: "Height (m)",
      pricingMethod: "Pricing Method *",
      askForQuote: "Ask for Quote",
      acceptBids: "Accept Bids",
    },
    locations: {
      title: "Pickup & Delivery Locations",
      pickupLocation: "Pickup Location *",
      deliveryLocation: "Delivery Location *",
      pickupPlaceholder: "Enter pickup location...",
      deliveryPlaceholder: "Enter delivery location...",
      cargoAvailability: "Cargo Availability",
      alwaysAvailable: "Always Available",
      alwaysAvailableDesc: "Ready to ship anytime",
      readyFromDate: "Ready From Date",
      readyFromDateDesc: "Available from specific date",
      notReady: "Not Ready",
      notReadyDesc: "Still preparing cargo",
      readyFromLabel: "Ready From Date",
      frequency: "Frequency",
      frequencyPlaceholder: "Select frequency",
    },
    truckRequirements: {
      title: "Truck Requirements",
      requiredFeatures: "Required Truck Features *",
      loadingMethods: "Loading Methods",
      unloadingMethods: "Unloading Methods",
      gpsMonitoring: "GPS Monitoring",
      requireGps: "Require GPS tracking for this shipment",
      gpsProviderPlaceholder: "Preferred GPS provider (optional)",
    },
    pricing: {
      title: "Pricing & Payment Terms",
      budgetExcludingVat: "Budget (excluding VAT)",
      budgetIncludingVat: "Budget (including VAT)",
      cashPayment: "Cash Payment",
      pricingMethod: "Pricing Method",
      pricingMethodPlaceholder: "Select pricing method",
      paymentTerms: "Payment Terms (days)",
      paymentTermsPlaceholder: "Select payment terms",
      immediatePayment: "Immediate Payment",
      days: "days",
    },
    summary: {
      title: "Order Summary",
      cargo: "Cargo:",
      weight: "Weight:",
      route: "Route:",
      truckOptions: "Truck Options:",
      selected: "selected",
      budget: "Budget:",
    },
    intervals: {
      everyDay: "Every Day",
      workingDays: "Working Days Only",
      everyWeek: "Every Week",
      twiceAWeek: "Twice a Week",
      everyMonth: "Every Month",
    },
    navigation: {
      previous: "Previous",
      continue: "Continue",
      posting: "Posting...",
      postCargo: "Post Cargo",
    },
    validation: {
      selectAddresses: "Please select both load and unload addresses",
      createOrderFailed: "Failed to create order. Please try again.",
      createOrderSuccess: "Cargo posted successfully!",
    },
  },
  postTruck: {
    title: "Post Your Truck",
    subtitle: "Share your truck availability and connect with cargo owners",
    steps: {
      truckDetails: "Truck Details",
      specifications: "Specifications",
      routesAvailability: "Routes & Availability",
      pricingTerms: "Pricing & Terms",
    },
    truckDetails: {
      title: "Truck Details",
      truckNumber: "Truck Number",
      truckNumberPlaceholder: "Enter truck license plate number",
      truckType: "Truck Type",
      truckTypePlaceholder: "Select truck type",
      trailerType: "Trailer Type",
      loadCapacity: "Load Capacity (tons)",
      loadCapacityPlaceholder: "Enter maximum load capacity",
      volume: "Volume (m³)",
      volumePlaceholder: "Enter cargo volume capacity",
      supportedLoadingMethods: "Supported Loading Methods",
    },
    specifications: {
      title: "Truck Specifications",
      truckDimensions: "Truck Dimensions (meters)",
      trailerDimensions: "Trailer Dimensions (meters)",
      lengthPlaceholder: "Length (m)",
      widthPlaceholder: "Width (m)",
      heightPlaceholder: "Height (m)",
      specialFeatures: "Special Features",
      tailgate: "Tailgate",
      hydraulicLift: "Hydraulic Lift",
      safetyCones: "Safety Cones",
      gpsMonitoring: "GPS Monitoring",
      gpsAvailable: "GPS tracking available for this truck",
      gpsProviderPlaceholder: "GPS provider name (optional)",
    },
    routes: {
      title: "Routes & Availability",
      startingLocation: "Starting Location",
      destinationLocation: "Destination Location",
      startingPlaceholder: "Enter starting location...",
      destinationPlaceholder: "Enter destination location...",
      serviceRadius: "Service Radius (km)",
      truckAvailability: "Truck Availability",
      alwaysAvailable: "Always Available",
      alwaysAvailableDesc: "Ready for jobs anytime",
      availableFromDate: "Available From Date",
      availableFromDateDesc: "Available from specific date",
      availableFromLabel: "Available From Date",
      readyFrom: "Ready from",
      frequency: "Frequency",
      frequencyPlaceholder: "Select frequency",
    },
    pricing: {
      title: "Pricing & Terms",
      pricingMethod: "Pricing Method",
      askForQuote: "Ask for Quote",
      acceptBids: "Accept Bids",
      rateExcludingVat: "Rate (excluding VAT)",
      rateIncludingVat: "Rate (including VAT)",
      cashRate: "Cash Rate",
      pricingMethodSelect: "Pricing Method",
      pricingMethodPlaceholder: "Select pricing method",
    },
    summary: {
      title: "Truck Summary",
      truckNumber: "Truck Number:",
      capacity: "Capacity:",
      volume: "Volume:",
      route: "Route:",
      loadTypes: "Load Types:",
      selected: "selected",
      rate: "Rate:",
      any: "Any",
    },
    trailerTypes: {
      truck: "Truck",
      trailer: "Trailer",
      semiTrailer: "Semi Trailer",
    },
    intervals: {
      everyDay: "Every Day",
      twiceAWeek: "Twice a Week",
      everyWeek: "Every Week",
      everyMonth: "Every Month",
      often: "Often",
      contractBased: "Contract Based",
      workingDays: "Working Days Only",
    },
    navigation: {
      previous: "Previous",
      continue: "Continue",
      posting: "Posting...",
      postTruck: "Post Truck",
    },
    validation: {
      createTruckFailed: "Failed to post truck. Please try again.",
      createTruckSuccess: "Truck posted successfully!",
    },
  },
  detailedTruck: {
    notFound: "Truck not found",
    notFoundDesc: "The truck with the specified ID does not exist or has been deleted",
    backToTrucks: "Back to trucks list",
    back: "Back",
    basicInfo: "Basic Information",
    specifications: "Specifications",
    routesAvailability: "Routes & Availability",
    pricing: "Pricing",
    ownerInfo: "Owner Information",
    contact: "Contact",
    radius: "Radius",
    fromLocation: "From",
    toLocation: "To",
    availability: "Availability",
    frequency: "Frequency",
    gpsEnabled: "GPS monitoring available",
    gpsNotAvailable: "GPS monitoring not available",
    cashPayment: "Cash",
    acceptsBids: "Accepts bids",
    fixedPrice: "Fixed price",
    legalEntity: "Legal entity",
    individual: "Individual",
    memberSince: "Member since",
    callOwner: "Call owner",
    sendMessage: "Send message",
  },
  exportersCatalog: {
    title: "Exporters Catalog",
    subtitle: "Find exporters and cargo owners for cooperation",
    search: {
      placeholder: "Search by company name...",
      byCompany: "By company",
      byCountry: "By country",
      byActivity: "By activity",
      byGoods: "By goods",
      searchButton: "Search",
      clearFilters: "Clear filters",
    },
    table: {
      headers: {
        company: "Company",
        tin: "TIN",
        activity: "Activity sphere",
        goods: "Goods",
        capacity: "Annual capacity",
        representative: "Representative",
        country: "Country",
        contacts: "Contacts",
        actions: "Actions",
      },
      viewProfile: "View profile",
      sendMessage: "Send message",
      callNow: "Call now",
      emailNow: "Email now",
    },
    filters: {
      allCountries: "All countries",
      allActivities: "All activities",
      allGoods: "All goods",
    },
    empty: {
      title: "No exporters found",
      message: "Try changing search criteria",
    },
    error: {
      title: "Loading error",
      message: "Failed to load exporters data",
    },
  },
  filterCargo: {
    location: {
      pickupLocation: "Pickup Location",
      pickupPlaceholder: "Enter pickup location...",
      deliveryLocation: "Delivery Location",
      deliveryPlaceholder: "Enter delivery location...",
    },
    cargoDetails: {
      weight: "Weight (tons)",
      weightPlaceholder: "0",
      price: "Price",
      pricePlaceholder: "0",
    },
  },
  filterTrucks: {
    location: {
      pickupLocation: "Pickup Location",
      pickupPlaceholder: "Enter pickup location...",
      deliveryLocation: "Delivery Location",
      deliveryPlaceholder: "Enter delivery location...",
    },
    truckDetails: {
      weight: "Load Capacity (tons)",
      weightPlaceholder: "0",
      price: "Price",
      pricePlaceholder: "0",
    },
  },
};

// Узбекские переводы
export const uzTranslations: Translations = {
  ordersTable: {
    headers: {
      cargo: "Yuk",
      characteristics: "Xususiyatlar",
      price: "Narx",
      from: "Qayerdan",
      to: "Qayerga",
      status: "Holat",
      actions: "Amallar",
    },
    cargoType: "Yuk turi:",
    packaging: "Qadoqlash:",
    actions: {
      details: "Batafsil",
    },
    error: {
      title: "Buyurtmalarni yuklashda xatolik",
      message:
        "Buyurtmalar ro'yxatini yuklab bo'lmadi. Sahifani yangilashga harakat qiling.",
    },
    empty: {
      title: "Buyurtmalar yo'q",
      message: "Buyurtmalar yaratilganda shu yerda paydo bo'ladi.",
    },
    summary: "Ko'rsatilgan",
    updated: "Hozirgina yangilandi",
    orders: "buyurtmalar",
  },
  status: {
    readyFrom: "dan tayyor",
    always: "Har doim tayyor",
    notReady: "Tayyor emas",
    statusError: "Holat xatosi",
    notSpecified: "Holat ko'rsatilmagan",
    active: "Faol",
    inactive: "Faol emas",
  },
  common: {
    notSpecified: "Ko'rsatilmagan",
    standard: "Standart",
    loading: "Yuklanmoqda...",
    error: "Xatolik",
    noTitle: "Sarlavha yo'q",
    kg: "kg",
    ton: "t",
    withVat: "QQS bilan",
    withoutVat: "QQS siz",
    negotiable: "Kelishiladi",
    som: "so'm",
    notDimensioned: "Ko'rsatilmagan",
    typeLabel: "Tur",
    pricingType: "Narx turi",
  },
  bid: {
    offer: "TAKLIF",
    request: "SO'ROV",
  },
  header: {
    findCars: "Mashinalar topish",
    findCargos: "Yuklar topish",
    postCar: "Mashina e'lon qilish",
    postCargo: "Yuk e'lon qilish",
    menu: "Menyu",
    profile: "Profil",
    signOut: "Chiqish",
    signIn: "Kirish",
  },
  pages: {
    home: "Bosh sahifa",
    orders: "Buyurtmalar",
    orderDetails: "Buyurtma tafsilotlari",
    trucks: "Yuk mashinalari",
    truckDetails: "Yuk mashinasi tafsilotlari",
    profile: "Profil",
    login: "Kirish",
    exportersCatalog: "Eksportyorlar katalogi",
    myOrders: "Mening buyurtmalarim",
    myOrdersSubtitle: "Yuk buyurtmalarini boshqarish va kuzatish",
    myTrucks: "Mening yuk mashinalarim",
    myTrucksSubtitle: "Avtoparkni boshqarish va kuzatish",
  },
  myItems: {
    orders: {
      title: "Mening Yuk Buyurtmalarim",
      subtitle: "Siz yaratgan buyurtmalar • Jami: ",
      emptyTitle: "Siz hali buyurtma yaratmagansiz",
      emptyMessage: "Tashuvchilarni topish uchun birinchi yuk buyurtmangizni joylashtiring.",
      postFirst: "Birinchi Yukingizni Joylang",
      yourOrders: "Sizning buyurtmalaringiz: ",
      postNew: "Yangi Yuk Joylash",
    },
    trucks: {
      title: "Mening Yuk Mashinalarim",
      subtitle: "Siz joylagan yuk mashinalar • Jami: ",
      emptyTitle: "Siz hali yuk mashinasi joylashtirmagansiz",
      emptyMessage: "Yuk egalarini topish uchun birinchi yuk mashinangizni joylang.",
      postFirst: "Birinchi Mashinangizni Joylang",
      yourTrucks: "Sizning mashinalaringiz: ",
      postNew: "Yangi Mashina Joylash",
    },
    actions: {
      edit: "Tahrirlash",
      delete: "O'chirish",
      activate: "Faollashtirish",
      deactivate: "Faolsizlantirish",
      confirmDelete: "Buni o'chirishga ishonchingiz komilmi?",
    },
  },
  postCargo: {
    title: "Yuk joylash",
    subtitle: "Yukingiz uchun eng yaxshi tashuvchini toping",
    back: "Orqaga",
    steps: {
      cargoDetails: "Yuk tafsilotlari",
      locations: "Manzillar",
      truckRequirements: "Transport talablari",
      pricingTimeline: "Narx va muddatlar",
    },
    cargoDetails: {
      title: "Yuk tafsilotlari",
      cargoName: "Yuk nomi *",
      cargoNamePlaceholder: "Yuk tavsifini kiriting",
      loadType: "Yuk turi",
      loadTypePlaceholder: "Yuk turini tanlang",
      packageType: "Qadoqlash turi",
      packageTypePlaceholder: "Qadoqlash turini tanlang",
      weight: "Og'irligi *",
      weightPlaceholder: "0",
      volume: "Hajmi (m³)",
      volumePlaceholder: "0",
      dimensions: "O'lchamlari (Uzunlik × Kenglik × Balandlik)",
      dimensionsLength: "Uzunlik (m)",
      dimensionsWidth: "Kenglik (m)",
      dimensionsHeight: "Balandlik (m)",
      pricingMethod: "Narxlash usuli *",
      askForQuote: "Taklif so'rash",
      acceptBids: "Takliflarni qabul qilish",
    },
    locations: {
      title: "Yuklash va tushirish joylari",
      pickupLocation: "Yuklash joyi *",
      deliveryLocation: "Yetkazish joyi *",
      pickupPlaceholder: "Yuklash manzilini kiriting...",
      deliveryPlaceholder: "Yetkazish manzilini kiriting...",
      cargoAvailability: "Yuk tayyorligi",
      alwaysAvailable: "Doim tayyor",
      alwaysAvailableDesc: "Istalgan vaqtda jo'natishga tayyor",
      readyFromDate: "Sanadan tayyor",
      readyFromDateDesc: "Muayyan sanadan boshlab mavjud",
      notReady: "Tayyor emas",
      notReadyDesc: "Yuk hali tayyorlanmoqda",
      readyFromLabel: "Sanadan tayyor",
      frequency: "Takrorlanish",
      frequencyPlaceholder: "Takrorlanishni tanlang",
    },
    truckRequirements: {
      title: "Transport talablari",
      requiredFeatures: "Zarur transport xususiyatlari *",
      loadingMethods: "Yuklash usullari",
      unloadingMethods: "Tushirish usullari",
      gpsMonitoring: "GPS monitoring",
      requireGps: "Ushbu tashish uchun GPS kuzatuv talab qilinadi",
      gpsProviderPlaceholder: "Afzal ko'rilgan GPS provayder (ixtiyoriy)",
    },
    pricing: {
      title: "Narx va to'lov shartlari",
      budgetExcludingVat: "Byudjet (QQSsiz)",
      budgetIncludingVat: "Byudjet (QQS bilan)",
      cashPayment: "Naqd to'lov",
      pricingMethod: "Hisoblash usuli",
      pricingMethodPlaceholder: "Hisoblash usulini tanlang",
      paymentTerms: "To'lov shartlari (kun)",
      paymentTermsPlaceholder: "To'lov shartlarini tanlang",
      immediatePayment: "Darhol to'lov",
      days: "kun",
    },
    summary: {
      title: "Buyurtma xulosasi",
      cargo: "Yuk:",
      weight: "Og'irligi:",
      route: "Yo'nalish:",
      truckOptions: "Transport variantlari:",
      selected: "tanlangan",
      budget: "Byudjet:",
    },
    intervals: {
      everyDay: "Har kuni",
      workingDays: "Faqat ish kunlari",
      everyWeek: "Har hafta",
      twiceAWeek: "Haftada ikki marta",
      everyMonth: "Har oy",
    },
    navigation: {
      previous: "Orqaga",
      continue: "Davom etish",
      posting: "Joylashtirilmoqda...",
      postCargo: "Yukni joylashtirish",
    },
    validation: {
      selectAddresses: "Iltimos, yuklash va tushirish manzillarini tanlang",
      createOrderFailed: "Buyurtma yaratib bo'lmadi. Qayta urinib ko'ring.",
      createOrderSuccess: "Yuk muvaffaqiyatli joylashtirildi!",
    },
  },
  postTruck: {
    title: "Yuk mashinangizni joylashtiring",
    subtitle: "Yuk mashinangizning mavjudligini ulashing va yuk egalariga ulanishish",
    steps: {
      truckDetails: "Yuk mashinasi tafsilotlari",
      specifications: "Texnik xususiyatlar",
      routesAvailability: "Yo'nalishlar va mavjudlik",
      pricingTerms: "Narxlar va shartlar",
    },
    truckDetails: {
      title: "Yuk mashinasi tafsilotlari",
      truckNumber: "Yuk mashinasi raqami",
      truckNumberPlaceholder: "Yuk mashinasi litsenziya raqamini kiriting",
      truckType: "Yuk mashinasi turi",
      truckTypePlaceholder: "Yuk mashinasi turini tanlang",
      trailerType: "Tirkama turi",
      loadCapacity: "Yuk sig'imi (tonna)",
      loadCapacityPlaceholder: "Maksimal yuk sig'imini kiriting",
      volume: "Hajm (m³)",
      volumePlaceholder: "Yuk hajmi sig'imini kiriting",
      supportedLoadingMethods: "Qo'llab-quvvatlanadigan yuklash usullari",
    },
    specifications: {
      title: "Yuk mashinasi texnik xususiyatlari",
      truckDimensions: "Yuk mashinasi o'lchamlari (metr)",
      trailerDimensions: "Tirkama o'lchamlari (metr)",
      lengthPlaceholder: "Uzunlik (m)",
      widthPlaceholder: "Kenglik (m)",
      heightPlaceholder: "Balandlik (m)",
      specialFeatures: "Maxsus xususiyatlar",
      tailgate: "Orqa bort",
      hydraulicLift: "Gidravlik ko'taruvchi",
      safetyCones: "Xavfsizlik konuslari",
      gpsMonitoring: "GPS monitoring",
      gpsAvailable: "Ushbu yuk mashinasi uchun GPS kuzatuv mavjud",
      gpsProviderPlaceholder: "GPS provayder nomi (ixtiyoriy)",
    },
    routes: {
      title: "Yo'nalishlar va mavjudlik",
      startingLocation: "Boshlang'ich joylashuv",
      destinationLocation: "Manzil joylashuvi",
      startingPlaceholder: "Boshlang'ich joylashuvni kiriting...",
      destinationPlaceholder: "Manzil joylashuvini kiriting...",
      serviceRadius: "Xizmat radiusi (km)",
      truckAvailability: "Yuk mashinasi mavjudligi",
      alwaysAvailable: "Doim mavjud",
      alwaysAvailableDesc: "Istalgan vaqtda ishlashga tayyor",
      availableFromDate: "Sanadan boshlab mavjud",
      availableFromDateDesc: "Belgilangan sanadan boshlab mavjud",
      availableFromLabel: "Sanadan boshlab mavjud",
      readyFrom: "dan tayyor",
      frequency: "Chastota",
      frequencyPlaceholder: "Chastotani tanlang",
    },
    pricing: {
      title: "Narxlar va shartlar",
      pricingMethod: "Narxlash usuli",
      askForQuote: "Taklif so'rash",
      acceptBids: "Takliflarni qabul qilish",
      rateExcludingVat: "Tarif (QQSsiz)",
      rateIncludingVat: "Tarif (QQS bilan)",
      cashRate: "Naqd tarif",
      pricingMethodSelect: "Narxlash usuli",
      pricingMethodPlaceholder: "Narxlash usulini tanlang",
    },
    summary: {
      title: "Yuk mashinasi xulasasi",
      truckNumber: "Yuk mashinasi raqami:",
      capacity: "Sig'im:",
      volume: "Hajm:",
      route: "Marshrut:",
      loadTypes: "Yuklash turlari:",
      selected: "tanlangan",
      rate: "Tarif:",
      any: "Har qanday",
    },
    trailerTypes: {
      truck: "Yuk mashinasi",
      trailer: "Tirkama",
      semiTrailer: "Yarim tirkama",
    },
    intervals: {
      everyDay: "Har kuni",
      twiceAWeek: "Haftada ikki marta",
      everyWeek: "Har hafta",
      everyMonth: "Har oy",
      often: "Tez-tez",
      contractBased: "Shartnoma asosida",
      workingDays: "Faqat ish kunlari",
    },
    navigation: {
      previous: "Orqaga",
      continue: "Davom etish",
      posting: "Joylashtirilmoqda...",
      postTruck: "Yuk mashinasini joylashtirish",
    },
    validation: {
      createTruckFailed: "Yuk mashinasini joylashtirib bo'lmadi. Qayta urinib ko'ring.",
      createTruckSuccess: "Yuk mashinasi muvaffaqiyatli joylashtirildi!",
    },
  },
  detailedTruck: {
    notFound: "Yuk mashinasi topilmadi",
    notFoundDesc: "Belgilangan ID bilan yuk mashinasi mavjud emas yoki o'chirilgan",
    backToTrucks: "Yuk mashinalari ro'yxatiga qaytish",
    back: "Orqaga",
    basicInfo: "Asosiy ma'lumotlar",
    specifications: "Xususiyatlar",
    routesAvailability: "Yo'nalishlar va mavjudlik",
    pricing: "Narx",
    ownerInfo: "Egasi haqida ma'lumot",
    contact: "Bog'lanish",
    radius: "Radius",
    fromLocation: "Qayerdan",
    toLocation: "Qayerga",
    availability: "Mavjudlik",
    frequency: "Chastota",
    gpsEnabled: "GPS monitoring mavjud",
    gpsNotAvailable: "GPS monitoring mavjud emas",
    cashPayment: "Naqd pul",
    acceptsBids: "Takliflarni qabul qiladi",
    fixedPrice: "Belgilangan narx",
    legalEntity: "Yuridik shaxs",
    individual: "Jismoniy shaxs",
    memberSince: "A'zo bo'lgan vaqt",
    callOwner: "Egasiga qo'ng'iroq qilish",
    sendMessage: "Xabar yuborish",
  },
  exportersCatalog: {
    title: "Eksportyorlar katalogi",
    subtitle: "Hamkorlik uchun eksportyorlar va yuk egalarini toping",
    search: {
      placeholder: "Kompaniya nomi bo'yicha qidirish...",
      byCompany: "Kompaniya bo'yicha",
      byCountry: "Mamlakat bo'yicha",
      byActivity: "Faoliyat bo'yicha",
      byGoods: "Tovarlar bo'yicha",
      searchButton: "Qidirish",
      clearFilters: "Filtrlarni tozalash",
    },
    table: {
      headers: {
        company: "Kompaniya",
        tin: "STIR",
        activity: "Faoliyat sohasi",
        goods: "Tovarlar",
        capacity: "Yillik hajm",
        representative: "Vakil",
        country: "Mamlakat",
        contacts: "Kontaktlar",
        actions: "Amallar",
      },
      viewProfile: "Profilni ko'rish",
      sendMessage: "Xabar yuborish",
      callNow: "Qo'ng'iroq qilish",
      emailNow: "Email yuborish",
    },
    filters: {
      allCountries: "Barcha mamlakatlar",
      allActivities: "Barcha sohalar",
      allGoods: "Barcha tovarlar",
    },
    empty: {
      title: "Eksportyorlar topilmadi",
      message: "Qidiruv mezonlarini o'zgartirib ko'ring",
    },
    error: {
      title: "Yuklashda xatolik",
      message: "Eksportyorlar ma'lumotlarini yuklashda xatolik",
    },
  },
  filterCargo: {  
    location: {
      pickupLocation: "Yuklash joyi",
      pickupPlaceholder: "Yuklash joyini kiriting...",
      deliveryLocation: "Yetkazish joyi",
      deliveryPlaceholder: "Yetkazish joyini kiriting...",
    },
    cargoDetails: {
      weight: "Og'irligi (tonna)",
      weightPlaceholder: "0",
      price: "Narx",
      pricePlaceholder: "0",
    },
  },
  filterTrucks: {
    location: {
      pickupLocation: "Yuklash joyi",
      pickupPlaceholder: "Yuklash joyini kiriting...",
      deliveryLocation: "Yetkazish joyi",
      deliveryPlaceholder: "Yetkazish joyini kiriting...",
    },
    truckDetails: {
      weight: "Yuk ko'tarish qobiliyati (tonna)",
      weightPlaceholder: "0",
      price: "Narx",
      pricePlaceholder: "0",
    },
  },
};

// Казахские переводы
export const kzTranslations: Translations = {
  ordersTable: {
    headers: {
      cargo: "Жүк",
      characteristics: "Сипаттамалар",
      price: "Баға",
      from: "Қайдан",
      to: "Қайда",
      status: "Күй",
      actions: "Әрекеттер",
    },
    cargoType: "Жүк түрі:",
    packaging: "Қаптау:",
    actions: {
      details: "Толық",
    },
    error: {
      title: "Тапсырыстарды жүктеу қатесі",
      message:
        "Тапсырыстар тізімін жүктеу мүмкін болмады. Бетті жаңартып көріңіз.",
    },
    empty: {
      title: "Тапсырыстар жоқ",
      message: "Тапсырыстар жасалған кезде осы жерде пайда болады.",
    },
    summary: "Көрсетілген",
    updated: "Жаңа жаңартылды",
    orders: "тапсырыстар",
  },
  status: {
    readyFrom: "дан дайын",
    always: "Әрқашан дайын",
    notReady: "Дайын емес",
    statusError: "Күй қатесі",
    notSpecified: "Күй көрсетілмеген",
    active: "Белсенді",
    inactive: "Белсенді емес",
  },
  common: {
    notSpecified: "Көрсетілмеген",
    standard: "Стандартты",
    loading: "Жүктелуде...",
    error: "Қате",
    noTitle: "Атауы жоқ",
    kg: "кг",
    ton: "т",
    withVat: "ҚҚС-пен",
    withoutVat: "ҚҚС-сіз",
    negotiable: "Келісу бойынша",
    som: "теңге",
    notDimensioned: "Көрсетілмеген",
    typeLabel: "Түр",
    pricingType: "Баға түрі",
  },
  bid: {
    offer: "ҰСЫНЫС",
    request: "СҰРАУ",
  },
  header: {
    findCars: "Көліктерді табу",
    findCargos: "Жүктерді табу",
    postCar: "Көлік жариялау",
    postCargo: "Жүк жариялау",
    menu: "Мәзір",
    profile: "Профиль",
    signOut: "Шығу",
    signIn: "Кіру",
  },
  pages: {
    home: "Басты бет",
    orders: "Тапсырыстар",
    orderDetails: "Тапсырыс мәліметтері",
    trucks: "Жүк көліктері",
    truckDetails: "Жүк көлігінің мәліметтері",
    profile: "Профиль",
    login: "Кіру",
    exportersCatalog: "Экспорттаушылар каталогы",
    myOrders: "Менің тапсырыстарым",
    myOrdersSubtitle: "Жүк тапсырыстарын басқару және бақылау",
    myTrucks: "Менің жүк көліктерім",
    myTrucksSubtitle: "Автопаркті басқару және бақылау",
  },
  myItems: {
    orders: {
      title: "Менің Жүк Тапсырыстарым",
      subtitle: "Сіз жасаған тапсырыстар • Барлығы: ",
      emptyTitle: "Сіз әлі тапсырыс жасамадыңыз",
      emptyMessage: "Тасымалдаушыларды табу үшін алғашқы жүк тапсырысыңызды жариялаңыз.",
      postFirst: "Алғашқы Жүгіңізді Жариялаңыз",
      yourOrders: "Сіздің тапсырыстарыңыз: ",
      postNew: "Жаңа Жүк Жариялау",
    },
    trucks: {
      title: "Менің Жүк Көліктерім",
      subtitle: "Сіз жарияланған жүк көліктері • Барлығы: ",
      emptyTitle: "Сіз әлі жүк көлігін жариялағанжоқсыз",
      emptyMessage: "Жүк иелерін табу үшін алғашқы жүк көлігіңізді жариялаңыз.",
      postFirst: "Алғашқы Көлігіңізді Жариялаңыз",
      yourTrucks: "Сіздің көліктеріңіз: ",
      postNew: "Жаңа Көлік Жариялау",
    },
    actions: {
      edit: "Өңдеу",
      delete: "Жою",
      activate: "Белсендіру",
      deactivate: "Өшіру",
      confirmDelete: "Мұны жойғыңыз келе ме?",
    },
  },
  postCargo: {
    title: "Жүк орналастыру",
    subtitle: "Жүгіңіз үшін ең жақсы тасымалдаушыны табыңыз",
    back: "Артқа",
    steps: {
      cargoDetails: "Жүк мәліметтері",
      locations: "Мекенжайлар",
      truckRequirements: "Көлік талаптары",
      pricingTimeline: "Баға және мерзімдер",
    },
    cargoDetails: {
      title: "Жүк мәліметтері",
      cargoName: "Жүк атауы *",
      cargoNamePlaceholder: "Жүк сипаттамасын енгізіңіз",
      loadType: "Жүк түрі",
      loadTypePlaceholder: "Жүк түрін таңдаңыз",
      packageType: "Орау түрі",
      packageTypePlaceholder: "Орау түрін таңдаңыз",
      weight: "Салмағы *",
      weightPlaceholder: "0",
      volume: "Көлемі (м³)",
      volumePlaceholder: "0",
      dimensions: "Өлшемдері (Ұзындық × Ені × Биіктігі)",
      dimensionsLength: "Ұзындық (м)",
      dimensionsWidth: "Ені (м)",
      dimensionsHeight: "Биіктігі (м)",
      pricingMethod: "Баға белгілеу әдісі *",
      askForQuote: "Ұсыныс сұрау",
      acceptBids: "Ұсыныстарды қабылдау",
    },
    locations: {
      title: "Жүктеу және түсіру орындары",
      pickupLocation: "Жүктеу орны *",
      deliveryLocation: "Жеткізу орны *",
      pickupPlaceholder: "Жүктеу мекенжайын енгізіңіз...",
      deliveryPlaceholder: "Жеткізу мекенжайын енгізіңіз...",
      cargoAvailability: "Жүк дайындығы",
      alwaysAvailable: "Әрқашан дайын",
      alwaysAvailableDesc: "Кез келген уақытта жіберуге дайын",
      readyFromDate: "Күннен дайын",
      readyFromDateDesc: "Белгілі күннен бастап қолжетімді",
      notReady: "Дайын емес",
      notReadyDesc: "Жүк әлі дайындалуда",
      readyFromLabel: "Күннен дайын",
      frequency: "Жиілігі",
      frequencyPlaceholder: "Жиілікті таңдаңыз",
    },
    truckRequirements: {
      title: "Көлік талаптары",
      requiredFeatures: "Қажетті көлік ерекшеліктері *",
      loadingMethods: "Жүктеу әдістері",
      unloadingMethods: "Түсіру әдістері",
      gpsMonitoring: "GPS мониторинг",
      requireGps: "Бұл тасымалдау үшін GPS бақылау қажет",
      gpsProviderPlaceholder: "Қалаулы GPS провайдер (міндетті емес)",
    },
    pricing: {
      title: "Баға және төлем шарттары",
      budgetExcludingVat: "Бюджет (ҚҚС-сыз)",
      budgetIncludingVat: "Бюджет (ҚҚС-пен)",
      cashPayment: "Қолма-қол төлем",
      pricingMethod: "Есептеу әдісі",
      pricingMethodPlaceholder: "Есептеу әдісін таңдаңыз",
      paymentTerms: "Төлем шарттары (күн)",
      paymentTermsPlaceholder: "Төлем шарттарын таңдаңыз",
      immediatePayment: "Лезде төлем",
      days: "күн",
    },
    summary: {
      title: "Тапсырыс қорытындысы",
      cargo: "Жүк:",
      weight: "Салмағы:",
      route: "Бағыт:",
      truckOptions: "Көлік нұсқалары:",
      selected: "таңдалған",
      budget: "Бюджет:",
    },
    intervals: {
      everyDay: "Күн сайын",
      workingDays: "Тек жұмыс күндері",
      everyWeek: "Апта сайын",
      twiceAWeek: "Аптасына екі рет",
      everyMonth: "Ай сайын",
    },
    navigation: {
      previous: "Артқа",
      continue: "Жалғастыру",
      posting: "Орналастырылуда...",
      postCargo: "Жүкті орналастыру",
    },
    validation: {
      selectAddresses: "Жүктеу және түсіру мекенжайларын таңдаңыз",
      createOrderFailed: "Тапсырыс жасау мүмкін болмады. Қайталап көріңіз.",
      createOrderSuccess: "Жүк сәтті орналастырылды!",
    },
  },
  postTruck: {
    title: "Жүк машинаңызды орналастырыңыз",
    subtitle: "Жүк машинаңыздың қолжетімділігін бөлісіңіз және жүк иелерімен байланысыңыз",
    steps: {
      truckDetails: "Жүк машинасының мәліметтері",
      specifications: "Техникалық сипаттамалар",
      routesAvailability: "Бағыттар және қолжетімділік",
      pricingTerms: "Бағалар және шарттар",
    },
    truckDetails: {
      title: "Жүк машинасының мәліметтері",
      truckNumber: "Жүк машинасының нөмірі",
      truckNumberPlaceholder: "Жүк машинасының лицензия нөмірін енгізіңіз",
      truckType: "Жүк машинасының түрі",
      truckTypePlaceholder: "Жүк машинасының түрін таңдаңыз",
      trailerType: "Тіркеменің түрі",
      loadCapacity: "Жүк сыйымдылығы (тонна)",
      loadCapacityPlaceholder: "Максималды жүк сыйымдылығын енгізіңіз",
      volume: "Көлем (м³)",
      volumePlaceholder: "Жүк көлемінің сыйымдылығын енгізіңіз",
      supportedLoadingMethods: "Қолдау көрсетілетін жүктеу әдістері",
    },
    specifications: {
      title: "Жүк машинасының техникалық сипаттамалары",
      truckDimensions: "Жүк машинасының өлшемдері (метр)",
      trailerDimensions: "Тіркеменің өлшемдері (метр)",
      lengthPlaceholder: "Ұзындық (м)",
      widthPlaceholder: "Ені (м)",
      heightPlaceholder: "Биіктік (м)",
      specialFeatures: "Арнайы мүмкіндіктер",
      tailgate: "Артқы борт",
      hydraulicLift: "Гидравликалық көтеру",
      safetyCones: "Қауіпсіздік конустары",
      gpsMonitoring: "GPS мониторинг",
      gpsAvailable: "Бұл жүк машинасы үшін GPS бақылау қолжетімді",
      gpsProviderPlaceholder: "GPS провайдер атауы (міндетті емес)",
    },
    routes: {
      title: "Бағыттар және қолжетімділік",
      startingLocation: "Бастапқы орын",
      destinationLocation: "Мақсат орны",
      startingPlaceholder: "Бастапқы орынды енгізіңіз...",
      destinationPlaceholder: "Мақсат орнын енгізіңіз...",
      serviceRadius: "Қызмет радиусы (км)",
      truckAvailability: "Жүк машинасының қолжетімділігі",
      alwaysAvailable: "Әрқашан қолжетімді",
      alwaysAvailableDesc: "Кез келген уақытта жұмысқа дайын",
      availableFromDate: "Күннен бастап қолжетімді",
      availableFromDateDesc: "Белгіленген күннен бастап қолжетімді",
      availableFromLabel: "Күннен бастап қолжетімді",
      readyFrom: "дан дайын",
      frequency: "Жиілік",
      frequencyPlaceholder: "Жиілікті таңдаңыз",
    },
    pricing: {
      title: "Бағалар және шарттар",
      pricingMethod: "Баға белгілеу әдісі",
      askForQuote: "Ұсыныс сұрау",
      acceptBids: "Ұсыныстарды қабылдау",
      rateExcludingVat: "Тариф (ҚҚС-сыз)",
      rateIncludingVat: "Тариф (ҚҚС-пен)",
      cashRate: "Қолма-қол тариф",
      pricingMethodSelect: "Баға белгілеу әдісі",
      pricingMethodPlaceholder: "Баға белгілеу әдісін таңдаңыз",
    },
    summary: {
      title: "Жүк машинасының қорытындысы",
      truckNumber: "Жүк машинасының нөмірі:",
      capacity: "Сыйымдылық:",
      volume: "Көлем:",
      route: "Маршрут:",
      loadTypes: "Жүктеу түрлері:",
      selected: "таңдалған",
      rate: "Тариф:",
      any: "Кез келген",
    },
    trailerTypes: {
      truck: "Жүк машинасы",
      trailer: "Тіркеме",
      semiTrailer: "Жартылай тіркеме",
    },
    intervals: {
      everyDay: "Күн сайын",
      twiceAWeek: "Аптасына екі рет",
      everyWeek: "Апта сайын",
      everyMonth: "Ай сайын",
      often: "Жиі",
      contractBased: "Шарт негізінде",
      workingDays: "Тек жұмыс күндері",
    },
    navigation: {
      previous: "Артқа",
      continue: "Жалғастыру",
      posting: "Орналастырылуда...",
      postTruck: "Жүк машинасын орналастыру",
    },
    validation: {
      createTruckFailed: "Жүк машинасын орналастыру мүмкін болмады. Қайталап көріңіз.",
      createTruckSuccess: "Жүк машинасы сәтті орналастырылды!",
    },
  },
  detailedTruck: {
    notFound: "Жүк машинасы табылмады",
    notFoundDesc: "Көрсетілген ID-мен жүк машинасы жоқ немесе жойылған",
    backToTrucks: "Жүк машиналары тізіміне оралу",
    back: "Артқа",
    basicInfo: "Негізгі ақпарат",
    specifications: "Сипаттамалар",
    routesAvailability: "Бағыттар және қолжетімділік",
    pricing: "Бағасы",
    ownerInfo: "Иесі туралы ақпарат",
    contact: "Байланысу",
    radius: "Радиус",
    fromLocation: "Қайдан",
    toLocation: "Қайда",
    availability: "Қолжетімділік",
    frequency: "Жиілік",
    gpsEnabled: "GPS мониторинг қолжетімді",
    gpsNotAvailable: "GPS мониторинг қолжетімді емес",
    cashPayment: "Қолма-қол ақша",
    acceptsBids: "Ұсыныстарды қабылдайды",
    fixedPrice: "Тұрақты баға",
    legalEntity: "Заңды тұлға",
    individual: "Жеке тұлға",
    memberSince: "Мүшелік басталған уақыт",
    callOwner: "Иесіне қоңырау шалу",
    sendMessage: "Хабарлама жіберу",
  },
  exportersCatalog: {
    title: "Экспорттаушылар каталогы",
    subtitle: "Ынтымақтастық үшін экспорттаушылар мен жүк иелерін табыңыз",
    search: {
      placeholder: "Компания атауы бойынша іздеу...",
      byCompany: "Компания бойынша",
      byCountry: "Ел бойынша",
      byActivity: "Қызмет бойынша",
      byGoods: "Тауарлар бойынша",
      searchButton: "Іздеу",
      clearFilters: "Сүзгілерді тазалау",
    },
    table: {
      headers: {
        company: "Компания",
        tin: "БСН",
        activity: "Қызмет саласы",
        goods: "Тауарлар",
        capacity: "Жылдық көлем",
        representative: "Өкіл",
        country: "Ел",
        contacts: "Байланыстар",
        actions: "Әрекеттер",
      },
      viewProfile: "Профильді көру",
      sendMessage: "Хабарлама жіберу",
      callNow: "Қоңырау шалу",
      emailNow: "Email жіберу",
    },
    filters: {
      allCountries: "Барлық елдер",
      allActivities: "Барлық салалар",
      allGoods: "Барлық тауарлар",
    },
    empty: {
      title: "Экспорттаушылар табылмады",
      message: "Іздеу критерийлерін өзгертіп көріңіз",
    },
    error: {
      title: "Жүктеу қатесі",
      message: "Экспорттаушылар деректерін жүктеу сәтсіз аяқталды",
    },
  },
  filterCargo: {
    location: {
      pickupLocation: "Жүктеу орны",
      pickupPlaceholder: "Жүктеу орнын енгізіңіз...",
      deliveryLocation: "Жеткізу орны",
      deliveryPlaceholder: "Жеткізу орнын енгізіңіз...",
    },
    cargoDetails: {
      weight: "Салмағы (тонна)",
      weightPlaceholder: "0",
      price: "Баға",
      pricePlaceholder: "0",
    },
  },
  filterTrucks: {
    location: {
      pickupLocation: "Жүктеу орны",
      pickupPlaceholder: "Жүктеу орнын енгізіңіз...",
      deliveryLocation: "Жеткізу орны",
      deliveryPlaceholder: "Жеткізу орнын енгізіңіз...",
    },
    truckDetails: {
      weight: "Жүк көтеру қабілеті (тонна)",
      weightPlaceholder: "0",
      price: "Баға",
      pricePlaceholder: "0",
    },
  },
};

// Каракалпакские переводы (базовые, можно расширить)
export const kaaTranslations: Translations = {
  ordersTable: {
    headers: {
      cargo: "Yük",
      characteristics: "Házirlikler",
      price: "Baha",
      from: "Qaydan",
      to: "Qayga",
      status: "Haql",
      actions: "Ámellar",
    },
    cargoType: "Yük túri:",
    packaging: "Qaplama:",
    actions: {
      details: "Tolıq",
    },
    error: {
      title: "Buyırtpanı júkteyde qátelik",
      message: "Buyırtpalar dizimin júktep bolmadı. Betti jańartıp kóriń.",
    },
    empty: {
      title: "Buyırtpalar joq",
      message: "Buyırtpalar jaratılǵanda bul jerde payda boladı.",
    },
    summary: "Kórsetilgen",
    updated: "Jańa jańartıldı",
    orders: "buyırtpalar",
  },
  status: {
    readyFrom: "dan tayar",
    always: "Házir tayar",
    notReady: "Tayar emes",
    statusError: "Haql qátesi",
    notSpecified: "Haql kórsetilmegen",
    active: "Belsenli",
    inactive: "Belsenli emes",
  },
  common: {
    notSpecified: "Kórsetilmegen",
    standard: "Standart",
    loading: "Júktelýde...",
    error: "Qáte",
    noTitle: "Atawı joq",
    kg: "kg",
    ton: "t",
    withVat: "QQS penen",
    withoutVat: "QQS siz",
    negotiable: "Kelisim boyınsha",
    som: "som",
    notDimensioned: "Kórsetilmegen",
    typeLabel: "Túr",
    pricingType: "Baha túri",
  },
  bid: {
    offer: "USINIS",
    request: "ÓTINIK",
  },
  header: {
    findCars: "Kóliklerdi tabıw",
    findCargos: "Júklerdi tabıw",
    postCar: "Kólik jariyalaw",
    postCargo: "Júk jariyalaw",
    menu: "Meniý",
    profile: "Profil",
    signOut: "Shıǵıw",
    signIn: "Kiriw",
  },
  pages: {
    home: "Bas bet",
    orders: "Buyırtpalar",
    orderDetails: "Buyırtpa malimatları",
    trucks: "Júk kólikteri",
    truckDetails: "Júk kólik malimatları",
    profile: "Profil",
    login: "Kiriw",
    exportersCatalog: "Eksporttawshılar katalogı",
    myOrders: "Meniń buyırtpalarım",
    myOrdersSubtitle: "Júk buyırtpaların basqarıw hám qadaǧalaw",
    myTrucks: "Meniń júk kóliklerim",
    myTrucksSubtitle: "Avtoparkti basqarıw hám qadaǧalaw",
  },
  myItems: {
    orders: {
      title: "Meniń Júk Buyırtpalarım",
      subtitle: "Siz jasaǧan buyırtpalar • Barlıǧı: ",
      emptyTitle: "Siz áli buyırtpa jasaǧan joqsız",
      emptyMessage: "Tasımalawshılardı tabıw úshin birińshi júk buyırtpańızdı jariyalańız.",
      postFirst: "Birińshi Júgińizdi Jariyalańız",
      yourOrders: "Sizdiń buyırtpalariǹiz: ",
      postNew: "Jańa Júk Jariyalaw",
    },
    trucks: {
      title: "Meniń Júk Kóliklerim",
      subtitle: "Siz jariyalaǧan júk kólikleri • Barlıǧı: ",
      emptyTitle: "Siz áli júk kóligin jariyalaǧan joqsız",
      emptyMessage: "Júk iyelerın tabıw úshin birińshi júk kóligiǹizdi jariyalańız.",
      postFirst: "Birińshi Kóligiǹizdi Jariyalańız",
      yourTrucks: "Sizdiń kóliklerińiz: ",
      postNew: "Jańa Kólik Jariyalaw",
    },
    actions: {
      edit: "Óńdew",
      delete: "Óshiriw",
      activate: "Belsendiriw",
      deactivate: "Óshiriw",
      confirmDelete: "Bunı óshirgiǹiz kele me?",
    },
  },
  postCargo: {
    title: "Júk orınlastırıw",
    subtitle: "Júgiñiz úshin eñ jaqsı tasımalıwshını tabıñ",
    back: "Artqa",
    steps: {
      cargoDetails: "Júk malimatları",
      locations: "Mekenjaylar",
      truckRequirements: "Kólik talaplări",
      pricingTimeline: "Baga hám muddatlar",
    },
    cargoDetails: {
      title: "Júk malimatları",
      cargoName: "Júk atı *",
      cargoNamePlaceholder: "Júk sıpattamasın kirgizin",
      loadType: "Júk túri",
      loadTypePlaceholder: "Júk túrin tanlañ",
      packageType: "Qadaqlalıw túri",
      packageTypePlaceholder: "Qadaqlalıw túrin tanlañ",
      weight: "Awırlıgı *",
      weightPlaceholder: "0",
      volume: "Kólemi (m³)",
      volumePlaceholder: "0",
      dimensions: "Ólshemleri (Uzınlıq × Kenlik × Biyiklik)",
      dimensionsLength: "Uzınlıq (m)",
      dimensionsWidth: "Kenlik (m)",
      dimensionsHeight: "Biyiklik (m)",
      pricingMethod: "Baga belgilew ádisi *",
      askForQuote: "Usınıs suraw",
      acceptBids: "Usınısları qabıldaw",
    },
    locations: {
      title: "Júkletıw hám túsiriw orınları",
      pickupLocation: "Júkletıw orını *",
      deliveryLocation: "Jetkiziw orını *",
      pickupPlaceholder: "Júkletıw mekenjayın kirgizin...",
      deliveryPlaceholder: "Jetkiziw mekenjayın kirgizin...",
      cargoAvailability: "Júk dayınlıgı",
      alwaysAvailable: "Hámishan dayın",
      alwaysAvailableDesc: "Kez kelgen waqıtta jiberiwge dayın",
      readyFromDate: "Kúnnen dayın",
      readyFromDateDesc: "Belgilii kúnnen baslaw qoljetimli",
      notReady: "Dayın emes",
      notReadyDesc: "Júk áli dayınlanıwda",
      readyFromLabel: "Kúnnen dayın",
      frequency: "Jiilik",
      frequencyPlaceholder: "Jiilikti tanlañ",
    },
    truckRequirements: {
      title: "Kólik talaplări",
      requiredFeatures: "Qájetli kólik erekshilikteri *",
      loadingMethods: "Júkletıw ádisleri",
      unloadingMethods: "Túsiriw ádisleri",
      gpsMonitoring: "GPS monitoring",
      requireGps: "Bul tasımalıw úshin GPS baqlılaw qájet",
      gpsProviderPlaceholder: "Qálawlı GPS provayder (miydetsiz)",
    },
    pricing: {
      title: "Baga hám tólem sharıtları",
      budgetExcludingVat: "Byudjet (QQS-sız)",
      budgetIncludingVat: "Byudjet (QQS-pen)",
      cashPayment: "Qolma-qol tólem",
      pricingMethod: "Eseptew ádisi",
      pricingMethodPlaceholder: "Eseptew ádisin tanlañ",
      paymentTerms: "Tólem sharıtları (kún)",
      paymentTermsPlaceholder: "Tólem sharıtların tanlañ",
      immediatePayment: "Darhol tólem",
      days: "kún",
    },
    summary: {
      title: "Buyırtpa qorıtındısı",
      cargo: "Júk:",
      weight: "Awırlıgı:",
      route: "Bagıt:",
      truckOptions: "Kólik nusqaları:",
      selected: "tanlangan",
      budget: "Byudjet:",
    },
    intervals: {
      everyDay: "Kún sayın",
      workingDays: "Tek jumıs kúnleri",
      everyWeek: "Apta sayın",
      twiceAWeek: "Aptasına eki ret",
      everyMonth: "Ay sayın",
    },
    navigation: {
      previous: "Artqa",
      continue: "Jalğastırıw",
      posting: "Orınlastırılıwda...",
      postCargo: "Júkti orınlastırıw",
    },
    validation: {
      selectAddresses: "Júkletıw hám túsiriw mekenjayların tanlañ",
      createOrderFailed: "Buyırtpa jasalıp bolmadı. Qaytadan urınıp kóriñ.",
      createOrderSuccess: "Júk sátti orınlastırıldı!",
    },
  },
  postTruck: {
    title: "Júk mashinañızdı orınlastırıñ",
    subtitle: "Júk mashinañızdıñ qoljétimdiligın búlisip, júk iyelerimen baylanısıñ",
    steps: {
      truckDetails: "Júk mashinasınıñ málimettleri",
      specifications: "Texnikalıq sipattamalar",
      routesAvailability: "Bağıtlar hám qoljétimdilik",
      pricingTerms: "Bahalar hám shártlar",
    },
    truckDetails: {
      title: "Júk mashinasınıñ málimettleri",
      truckNumber: "Júk mashinasınıñ nómiri",
      truckNumberPlaceholder: "Júk mashinasınıñ licenziya nómirin kirgiziń",
      truckType: "Júk mashinasınıñ túri",
      truckTypePlaceholder: "Júk mashinasınıñ túrin tanlañ",
      trailerType: "Tirkemenıñ túri",
      loadCapacity: "Júk sıyımdılığı (tonna)",
      loadCapacityPlaceholder: "Maksimalda júk sıyımdılığın kirgiziń",
      volume: "Kólem (m³)",
      volumePlaceholder: "Júk kóleminiñ sıyımdılığın kirgiziń",
      supportedLoadingMethods: "Qollaw kórsetiletuğın júkletıw ádistleri",
    },
    specifications: {
      title: "Júk mashinasınıñ texnikalıq sipattamalar",
      truckDimensions: "Júk mashinasınıñ ólshemleri (metr)",
      trailerDimensions: "Tirkemenıñ ólshemleri (metr)",
      lengthPlaceholder: "Uzınlıq (m)",
      widthPlaceholder: "Eni (m)",
      heightPlaceholder: "Biyiklik (m)",
      specialFeatures: "Arnayi múmkinshilikler",
      tailgate: "Artqı bort",
      hydraulicLift: "Gidravlikalıq kóteriw",
      safetyCones: "Qáwipsizilik konusları",
      gpsMonitoring: "GPS monitoring",
      gpsAvailable: "Bul júk mashinası úshin GPS baqlıw qoljétimdi",
      gpsProviderPlaceholder: "GPS provayder atawı (mındetti emes)",
    },
    routes: {
      title: "Bağıtlar hám qoljétimdilik",
      startingLocation: "Bastapqı orın",
      destinationLocation: "Maqsat ornı",
      startingPlaceholder: "Bastapqı ornın kirgiziń...",
      destinationPlaceholder: "Maqsat ornın kirgiziń...",
      serviceRadius: "Qızmet radiusı (km)",
      truckAvailability: "Júk mashinasınıñ qoljétimdilik",
      alwaysAvailable: "Árqashan qoljétimdi",
      alwaysAvailableDesc: "Kez kelgen waqıtta jumısqa dayın",
      availableFromDate: "Kúnnen bastap qoljétimdi",
      availableFromDateDesc: "Belgilengen kúnnen bastap qoljétimdi",
      availableFromLabel: "Kúnnen bastap qoljétimdi",
      readyFrom: "dan tayar",
      frequency: "Jiilik",
      frequencyPlaceholder: "Jiilikti tanlañ",
    },
    pricing: {
      title: "Bahalar hám shártlar",
      pricingMethod: "Baha belgileyiw ádisi",
      askForQuote: "Usınıs surıw",
      acceptBids: "Usınıslar qabıldıw",
      rateExcludingVat: "Tarif (QQS-sız)",
      rateIncludingVat: "Tarif (QQS-pen)",
      cashRate: "Naq tarif",
      pricingMethodSelect: "Baha belgileyiw ádisi",
      pricingMethodPlaceholder: "Baha belgileyiw ádisin tanlañ",
    },
    summary: {
      title: "Júk mashinasınıñ qorıtındısı",
      truckNumber: "Júk mashinasınıñ nómiri:",
      capacity: "Sıyımdılıq:",
      volume: "Kólem:",
      route: "Marshrut:",
      loadTypes: "Júkletıw túrleri:",
      selected: "tanlangan",
      rate: "Tarif:",
      any: "Kez kelgen",
    },
    trailerTypes: {
      truck: "Júk mashinası",
      trailer: "Tirkeme",
      semiTrailer: "Jartılay tirkeme",
    },
    intervals: {
      everyDay: "Kún sayin",
      twiceAWeek: "Aptasına eki ret",
      everyWeek: "Apta sayin",
      everyMonth: "Ay sayin",
      often: "Jii",
      contractBased: "Shart negizinde",
      workingDays: "Tek jumıs kúnleri",
    },
    navigation: {
      previous: "Artqa",
      continue: "Jalğastırıw",
      posting: "Orınlastırılwda...",
      postTruck: "Júk mashinasın orınlastırıw",
    },
    validation: {
      createTruckFailed: "Júk mashinasın orınlastırıw múmkin bolmadı. Qaytadan urınıp kóriñ.",
      createTruckSuccess: "Júk mashinası sátti orınlastırıldı!",
    },
  },
  detailedTruck: {
    notFound: "Júk mashinası tabılmadı",
    notFoundDesc: "Kórsetilgen ID-men júk mashinası joq yamasa joyıldı",
    backToTrucks: "Júk mashinalları dizimige qaytıw",
    back: "Artqa",
    basicInfo: "Negizgi málimettler",
    specifications: "Sıpattamalar",
    routesAvailability: "Bağıtlar hám qoljetimlilik",
    pricing: "Bahası",
    ownerInfo: "Iyesi haqqında málimet",
    contact: "Baylanısıw",
    radius: "Radius",
    fromLocation: "Qaydan",
    toLocation: "Qayda",
    availability: "Qoljetimlilik",
    frequency: "Jiyilik",
    gpsEnabled: "GPS monitoring qoljetimli",
    gpsNotAvailable: "GPS monitoring qoljetimli emes",
    cashPayment: "Naqıt pul",
    acceptsBids: "Usınıslardı qabıl etedi",
    fixedPrice: "Túraqli baha",
    legalEntity: "Qánuniy túlğa",
    individual: "Jeke túlğa",
    memberSince: "Múshelik baslanğan waqıt",
    callOwner: "Iyesine telefon etıw",
    sendMessage: "Xabar jiberiw",
  },
  exportersCatalog: {
    title: "Eksporttawshılar katalogı",
    subtitle: "Hamkarlıq úshin eksporttawshılar hám júk iyelerın tabıń",
    search: {
      placeholder: "Kompaniya atı boyınsha izlew...",
      byCompany: "Kompaniya boyınsha",
      byCountry: "Mamleket boyınsha",
      byActivity: "Ishkerlık boyınsha",
      byGoods: "Towarlar boyınsha",
      searchButton: "Izlew",
      clearFilters: "Filterlerdı tazalaw",
    },
    table: {
      headers: {
        company: "Kompaniya",
        tin: "STIR",
        activity: "Ishkerlık tarmaği",
        goods: "Towarlar",
        capacity: "Jıllıq kólemi",
        representative: "Okil",
        country: "Mamleket",
        contacts: "Kontaktlar",
        actions: "Amallar",
      },
      viewProfile: "Profildi kórıw",
      sendMessage: "Xabar jiberiw",
      callNow: "Telefon etıw",
      emailNow: "Email jiberiw",
    },
    filters: {
      allCountries: "Barlıq mamlekettler",
      allActivities: "Barlıq tarmatlar",
      allGoods: "Barlıq towarlar",
    },
    empty: {
      title: "Eksporttawshılar tabılmadı",
      message: "Izlew kriteriylerın ózgertiw kerek",
    },
    error: {
      title: "Júklew qátesi",
      message: "Eksporttawshılar malımatların júklew sátsiz",
    },
  },
  filterCargo: {
    location: {
      pickupLocation: "Júkletıw orını",
      pickupPlaceholder: "Júkletıw orının kirgiziń...",
      deliveryLocation: "Jetkiziw orını",
      deliveryPlaceholder: "Jetkiziw orının kirgiziń...",
    },
    cargoDetails: {
      weight: "Awırlığı (tonna)",
      weightPlaceholder: "0",
      price: "Baha",
      pricePlaceholder: "0",
    },
  },
  filterTrucks: {
    location: {
      pickupLocation: "Júkletıw orını",
      pickupPlaceholder: "Júkletıw orının kirgiziń...",
      deliveryLocation: "Jetkiziw orını",
      deliveryPlaceholder: "Jetkiziw orının kirgiziń...",
    },
    truckDetails: {
      weight: "Júk köteriw qabılıeti (tonna)",
      weightPlaceholder: "0",
      price: "Baha",
      pricePlaceholder: "0",
    },
  },
};

// Объект со всеми переводами
export const translations: Record<SupportedLanguage, Translations> = {
  ru: ruTranslations,
  en: enTranslations,
  uz: uzTranslations,
  kz: kzTranslations,
  kaa: kaaTranslations,
};
