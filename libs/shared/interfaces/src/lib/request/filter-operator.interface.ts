import { ComparisonOperator } from './comparaison-operator.enum';

interface FilterBase<C extends ComparisonOperator, T> {
  operator: C;
  value: T;
}

export type EqualFilter = FilterBase<ComparisonOperator.EQUAL, string | number>;
export type NotEqualFilter = FilterBase<
  ComparisonOperator.NOT_EQUAL,
  string | number
>;
export type GreaterThanFilter = FilterBase<
  ComparisonOperator.GREATER_THAN,
  string | number
>;
export type GreaterThanOrEqualFilter = FilterBase<
  ComparisonOperator.GREATER_THAN_OR_EQUAL,
  string | number
>;
export type LessThanFilter = FilterBase<
  ComparisonOperator.LESS_THAN,
  string | number
>;
export type LessThanOrEqualFilter = FilterBase<
  ComparisonOperator.LESS_THAN_OR_EQUAL,
  string | number
>;
export type LikeFilter = FilterBase<ComparisonOperator.LIKE, string>;
export type NotLikeFilter = FilterBase<ComparisonOperator.NOT_LIKE, string>;
export type InFilter = FilterBase<ComparisonOperator.IN, (string | number)[]>;
export type NotInFilter = FilterBase<
  ComparisonOperator.NOT_IN,
  (string | number)[]
>;

export type FilterOperator =
  | EqualFilter
  | NotEqualFilter
  | GreaterThanFilter
  | GreaterThanOrEqualFilter
  | LessThanFilter
  | LessThanOrEqualFilter
  | LikeFilter
  | NotLikeFilter
  | InFilter
  | NotInFilter;
