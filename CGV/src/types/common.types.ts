// Common Types used across the application

export interface ApiResponse<T> {
  success?: boolean;
  datas: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface PagedResultRequestDto{
  page: number;
  pageSize: number;
}

export interface FilterClause{
  fieldName: string;
  value: string | number | boolean;
  operator: 'eq' | 'like' | 'gt' | 'lt';
}
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export enum Status {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted",
}

export interface SelectOption {
  label: string;
  value: string | number;
}
