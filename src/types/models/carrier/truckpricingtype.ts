// ===== LOCALIZED STRING INTERFACE =====
export interface LocalizedString {
  ru?: string;
  en?: string;
  uz?: string;
  kz?: string;
  kaa?: string;
}

// ===== TRUCK PRICING TYPE INTERFACE =====
export interface TruckPricingType {
  _id?: string;
  name: LocalizedString;
  __v?: number;
}
