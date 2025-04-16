import { Customer } from '../customer/customer.interface';

export interface Session {
  _id: string;
  userId: string;
  diagram_name: string;
  diagram_id: string;
  createdAt: Date;
  expiresAt: Date;
}
