import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ComparisonOperator } from '@closing/shared/interfaces';

export interface TableRequest {
  page?: number;
  limit?: number;
  sort?: { field: string; order: 'ASC' | 'DESC' }[];
  filter?: Record<string, any>;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TableRequestService {
  toHttpParams(request: TableRequest): HttpParams {
    let params = new HttpParams();

    // Handle pagination
    if (request.page !== undefined) {
      params = params.append('page', request.page.toString());
    }
    if (request.limit !== undefined) {
      params = params.append('limit', request.limit.toString());
    }

    // Handle sorting
    if (request.sort && request.sort.length > 0) {
      const sortString = request.sort
        .map((sort) => `${sort.field},${sort.order}`)
        .join(';');
      params = params.append('sort', sortString);
    }

    // Handle filtering
    if (request.filter) {
      const filterString = this.convertFilterToRsql(request.filter);
      if (filterString) {
        params = params.append('filter', filterString);
      }
    }

    // Handle search
    if (request.search) {
      params = params.append('search', request.search);
    }

    return params;
  }

  private convertFilterToRsql(filter: Record<string, any>): string {
    const conditions: string[] = [];

    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === 'object') {
        for (const [operator, val] of Object.entries(value)) {
          switch (operator) {
            case ComparisonOperator.EQUAL:
              conditions.push(`${key}==${val}`);
              break;
            case ComparisonOperator.NOT_EQUAL:
              conditions.push(`${key}!=${val}`);
              break;
            case ComparisonOperator.GREATER_THAN:
              conditions.push(`${key}>${val}`);
              break;
            case ComparisonOperator.GREATER_THAN_OR_EQUAL:
              conditions.push(`${key}>=${val}`);
              break;
            case ComparisonOperator.LESS_THAN:
              conditions.push(`${key}<${val}`);
              break;
            case ComparisonOperator.LESS_THAN_OR_EQUAL:
              conditions.push(`${key}<=${val}`);
              break;
            case ComparisonOperator.LIKE:
              conditions.push(`${key}=like=${val}`);
              break;
            case ComparisonOperator.NOT_LIKE:
              conditions.push(`${key}=notlike=${val}`);
              break;
            case ComparisonOperator.IN:
              conditions.push(
                `${key}=in=${Array.isArray(val) ? val.join(',') : val}`
              );
              break;
            case ComparisonOperator.NOT_IN:
              conditions.push(
                `${key}=out=${Array.isArray(val) ? val.join(',') : val}`
              );
              break;
          }
        }
      } else {
        conditions.push(`${key}==${value}`);
      }
    }

    return conditions.join(';');
  }

  fromHttpParams(params: HttpParams): TableRequest {
    const request: TableRequest = {};

    // Parse pagination
    const page = params.get('page');
    if (page) {
      request.page = parseInt(page, 10);
    }
    const limit = params.get('limit');
    if (limit) {
      request.limit = parseInt(limit, 10);
    }

    // Parse sorting
    const sort = params.get('sort');
    if (sort) {
      request.sort = sort.split(';').map((sortItem) => {
        const [field, order] = sortItem.split(',');
        return { field, order: order as 'ASC' | 'DESC' };
      });
    }

    // Parse filtering
    const filter = params.get('filter');
    if (filter) {
      request.filter = this.parseRsqlFilter(filter);
    }

    // Parse search
    const search = params.get('search');
    if (search) {
      request.search = search;
    }

    return request;
  }

  private parseRsqlFilter(filterString: string): Record<string, any> {
    const filter: Record<string, any> = {};
    const conditions = filterString.split(';');

    for (const condition of conditions) {
      const [field, operator, value] = condition.split(
        /(==|!=|>|>=|<|<=|=like=|=notlike=|=in=|=out=)/
      );

      if (!filter[field]) {
        filter[field] = {};
      }

      switch (operator) {
        case ComparisonOperator.EQUAL:
          filter[field][ComparisonOperator.EQUAL] = value;
          break;
        case ComparisonOperator.NOT_EQUAL:
          filter[field][ComparisonOperator.NOT_EQUAL] = value;
          break;
        case ComparisonOperator.GREATER_THAN:
          filter[field][ComparisonOperator.GREATER_THAN] = value;
          break;
        case ComparisonOperator.GREATER_THAN_OR_EQUAL:
          filter[field][ComparisonOperator.GREATER_THAN_OR_EQUAL] = value;
          break;
        case ComparisonOperator.LESS_THAN:
          filter[field][ComparisonOperator.LESS_THAN] = value;
          break;
        case ComparisonOperator.LESS_THAN_OR_EQUAL:
          filter[field][ComparisonOperator.LESS_THAN_OR_EQUAL] = value;
          break;
        case ComparisonOperator.LIKE:
          filter[field][ComparisonOperator.LIKE] = value;
          break;
        case ComparisonOperator.NOT_LIKE:
          filter[field][ComparisonOperator.NOT_LIKE] = value;
          break;
        case ComparisonOperator.IN:
          filter[field][ComparisonOperator.IN] = value.split(',');
          break;
        case ComparisonOperator.NOT_IN:
          filter[field][ComparisonOperator.NOT_IN] = value.split(',');
          break;
      }
    }

    return filter;
  }
}
