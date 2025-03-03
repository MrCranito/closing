import { RequestWithArguments } from '@closing/shared/interfaces';
import { HttpParams } from '@angular/common/http';
export class RequestUtil {
  static readonly filtersKey = 'filters';
  static readonly searchKey = 'search';
  static readonly sortKey = 'sort';
  static readonly pageKey = 'page';
  static readonly sizeKey = 'size';

  static toRsql(parameters: RequestWithArguments): HttpParams | undefined {
    let httpParameters: HttpParams = new HttpParams();

    const filterParameter: string | null =
      parameters.filters?.join(';') ?? null;

    const sortParameter: string | null = parameters.sorts?.join(';') ?? null;

    if (filterParameter) {
      httpParameters = httpParameters.append(
        RequestUtil.searchKey,
        filterParameter
      );
    }

    if (sortParameter) {
      httpParameters = httpParameters.append(
        RequestUtil.sortKey,
        sortParameter
      );
    }

    if (parameters.size !== undefined && parameters.size > 0) {
      const pageParameter: string | null = parameters.page?.toString() ?? null;
      const sizeParameter: string | null = parameters.size?.toString() ?? null;

      if (pageParameter) {
        httpParameters = httpParameters.append(
          RequestUtil.pageKey,
          pageParameter
        );
      }

      if (sizeParameter) {
        httpParameters = httpParameters.append(
          RequestUtil.sizeKey,
          sizeParameter
        );
      }
    }

    return httpParameters.keys().length > 0 ? httpParameters : undefined;
  }
}
