export interface PagedResult<T> {
    Results?: T[];
    CurrentPage?: number;
    PageCount?: number;
    PageSize?: number;
    RowCount?: number;
    FirstRowOnPage?: number;
    LastRowOnPage?: number;
}