import type { TruckOptions } from "../carrier/truckoptions";
import type { LoadType } from "./loadType";

// ===== LOCALIZED STRING INTERFACE =====
export interface LocalizedString {
  ru?: string;
  en?: string;
  uz?: string;
  kz?: string;
  kaa?: string;
}

// ===== ORDER INTERFACE =====
export interface Order {
  _id?: string;
  loadName: string;
  loadType?:
    | string
    | {
        _id: string;
        name: LocalizedString;
        __v?: number;
      }; // ObjectId as string or populated object with localized name
  loadPackage?:
    | string
    | {
        _id: string;
        name: LocalizedString;
        __v?: number;
      };
  volume?: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  bid: "yes" | "ask";
  weight: number;
  weightUnit: "kg" | "ton";
  loadStatus: {
    state: "ready_from" | "always" | "not_ready";
    readyFrom?: Date;
    interval?:
      | "every_day"
      | "in_working_days"
      | "every_month"
      | "twice_a_week"
      | "every_week";
  };
  loadAddress: {
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
  unloadAddress: {
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
  truckOptions: TruckOptions[]; // ObjectId array as string array
  loadTypes?: LoadType[]; // ObjectId array as string array or populated objects
  unloadTypes?: LoadType[]; // ObjectId array as string array or populated objects
  gpsMonitoring: {
    enabled?: boolean;
    provider?: string;
  };
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
  paymentWithin?: number;
  owner:
    | string
    | {
        _id: string;
        phone?: string;
        fullName?: string;
        __v?: number;
      }; // ObjectId as string or populated user object
  requestList: string[]; // ObjectId array as string array
  profile: {
    _id: string;
    userId: string;
    type: "individual" | "legal_entity";
    fullName?: string;
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
