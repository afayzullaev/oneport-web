// ===== LOCALIZED STRING INTERFACE =====
export interface LocalizedString {
  ru?: string;
  en?: string;
  uz?: string;
  kz?: string;
  kaa?: string;
}

// ===== TRUCK LOAD TYPE INTERFACE =====
export interface TruckLoadType {
  _id?: string;
  name: LocalizedString;
  __v?: number;
}
