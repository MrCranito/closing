export interface Customer {
  id: string;
  lastname: string;
  firstname: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: CustomerStatus;
  type?: CustomerType;
  source?: CustomerSource;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum CustomerStatus {
  COLD = 'COLD',
  PROSPECT = 'PROSPECT',
  HOT = 'HOT',
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export enum CustomerSource {
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  ONLINE_AD = 'ONLINE_AD',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
}
