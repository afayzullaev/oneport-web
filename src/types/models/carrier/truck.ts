// ===== LOCALIZED STRING INTERFACE =====
export interface LocalizedString {
  ru?: string;
  en?: string;
  uz?: string;
  kz?: string;
  kaa?: string;
}

// ===== TRUCK INTERFACE =====
export interface Truck {
  _id?: string;
  // Тип кузова
  truckOption:
    | string
    | {
        _id: string;
        name: LocalizedString;
        parentId?: string;
        __v?: number;
      }; // ObjectId as string or populated object with localized name
  trailerType: "truck" | "trailer" | "semi_trailer";

  // Типы загрузки (массив, так как может быть несколько)
  loadTypes: (
    | string
    | {
        _id: string;
        name: LocalizedString;
        __v?: number;
      }
  )[]; // ObjectId array as string array or populated objects

  // Характеристики
  loadCapacity: number; // Грузоподъемность в тоннах
  volume: number; // Объем кузова в м³
  truckNumber: string; // Номер машины

  // Размеры кузова
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  trailer_dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };

  // Дополнительные возможности
  features: {
    tailgate?: boolean; // Догруз
    hydraulicLift?: boolean; // Гидролифт
    cones?: boolean; // Коники
  };

  fromRadius?: number;
  fromAddress?: {
    osm_id: string;
    lat: number;
    lon: number;
    display_name: string;
    display_place: string;
    display_address: string;
    name: string;
    country: string;
    state: string;
    county: string;
    postcode: string;
    country_code: string;
    place_id: string;
  };

  toRadius: number;
  toAddress?: {
    osm_id: string;
    lat: number;
    lon: number;
    display_name: string;
    display_place: string;
    display_address: string;
    name: string;
    country: string;
    state: string;
    county: string;
    postcode: string;
    country_code: string;
    place_id: string;
  };

  // GPS мониторинг
  gpsMonitoring: {
    enabled?: boolean;
    provider?: string;
  };

  readyType: {
    type: "always" | "ready_from";
    readyFrom?: Date;
    interval?:
      | "every_day"
      | "twice_a_week"
      | "every_week"
      | "every_month"
      | "often"
      | "contract_based"
      | "in_working_days";
  };

  bid: "yes" | "ask";

  pricing?: {
    withVat: number;
    withoutVat: number;
    pricingType:
      | string
      | {
          _id: string;
          name: LocalizedString;
          __v?: number;
        }; // ObjectId as string or populated object with localized name
    cash: number;
  };

  owner:
    | string
    | {
        _id: string;
        phone?: string;
        fullName?: string;
        __v?: number;
      }; // ObjectId as string or populated user object
  isActive: boolean;
  profile: {
    _id: string;
    userId: string;
    fullName: string;
    type: "individual" | "legal_entity";
    businessType: "carrier" | "cargo_owner";
    isVerified?: boolean;
    phoneNumbers: string[];
    emails?: string[];
    country: string;
    postalCode: string;
    address: string;
    companyName?: string;
    createdAt: Date;
  };
}
