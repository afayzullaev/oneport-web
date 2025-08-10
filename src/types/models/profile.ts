// Profile data models from backend
export interface Profile {
  _id?: string;
  userId: string; // ObjectId as string
  type: 'individual' | 'legal_entity';
  businessType: 'carrier' | 'cargo_owner';
  activiyType?: string;
  goods?: string[];
  
  // Status
  isVerified?: boolean;
  rating?: number;

  // Contact info
  phoneNumbers: string[];
  emails?: string[];

  // Location
  country: string; // Country code
  postalCode: string;
  address: string;

  // Individual fields
  fullName?: string;
  birthDate?: string;
  passportNumber?: string;

  // Company fields
  companyName?: string;
  companyTIN?: string;
  companyRegistrationNumber?: string;
  representativeFullname?: string;
  representativePosition?: string;

  // Production capacity
  unit?: 'млн шт' | 'тонна' | 'шт' | 'комплект' | 'тыс шт' | 'тыс куб м' | 'тыс тонна' | 'тыс метр' | 'тыс м2' | 'млн штук' | 'тыс штук';
  annualProdcutionCapacity?: number;

  // Extra fields
  logo?: string;
  description?: string;
  
  // Subscription
  subscription?: {
    plan: 'Free' | 'Premium';
    duration: 'monthly' | 'yearly' | 'unlimited';
    startDate: Date;
    endDate: Date;
  };

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
