// ===== LOCALIZED STRING INTERFACE =====
export interface LocalizedString {
  ru?: string;
  en?: string;
  uz?: string;
  kz?: string;
  kaa?: string;
}

// ===== TRUCK OPTIONS INTERFACE =====
export interface TruckOptions {
  _id?: string;
  name: LocalizedString;
  parentId?: TruckOptions; // ObjectId as string
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
