export type SortDirection = 'asc' | 'desc';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}
