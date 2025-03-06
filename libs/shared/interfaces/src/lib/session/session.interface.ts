import { Customer } from '../customer/customer.interface';

export interface Session {
  id: string;
  name: string;
  description?: string;
  customer: Customer;
  tree_name: string;
  tree_id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'scheduled';
  duration?: number; // in minutes
  notes?: string;
}
