import { RequestFilter } from './request-filter.type';
import { RequestSort } from './request-sort.interface';

export interface RequestWithArguments {
  page?: number;
  size?: number;
  sorts?: RequestSort[];
  filters?: RequestFilter[];
}
