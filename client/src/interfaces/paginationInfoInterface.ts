export interface PaginationInfoInterface {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
