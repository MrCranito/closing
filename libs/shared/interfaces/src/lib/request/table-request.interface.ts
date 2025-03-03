import { RequestFilter } from './request-filter.type';
import { RequestSort } from './request-sort.interface';

export interface TableRequest {
  page: number;
  size: number;
  sorts: RequestSort[];
  filters: RequestFilter[];
}
