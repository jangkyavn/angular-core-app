export interface PagedResult {
    Results?: any[];
    CurrentPage?: number;
    PageCount?: number;
    PageSize?: number;
    RowCount?: number;
    FirstRowOnPage?: number;
    LastRowOnPage?: number;
}