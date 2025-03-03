export interface Client {
  id: string;
  lastname: string;
  firstname: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: ClientStatus;
  type?: ClientType;
  source?: ClientSource;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ClientStatus {
  COLD = 'COLD',
  PROSPECT = 'PROSPECT',
  HOT = 'HOT',
}

export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export enum ClientSource {
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  ONLINE_AD = 'ONLINE_AD',
  EVENT = 'EVENT',
}
