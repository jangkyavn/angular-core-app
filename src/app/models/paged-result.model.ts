export interface PagedResult {
    Result?: any[];
    CurrentPage?: number;
    PageCount?: number;
    PageSize?: number;
    RowCount?: number;
    FirstRowOnPage?: number;
    LastRowOnPage?: number;
}