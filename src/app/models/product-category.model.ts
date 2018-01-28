export interface ProductCategory { 
    Id?: number;
    Name?: string;
    SeoAlias?: string;
    ParentId?: any;
    Description?: string;
    Image?: string;
    DateCreated?: () => number,
    DateModified?: () => number,
    SortOrder?: number;
    SeoPageTitle?: string;
    SeoKeywords?: string;
    SeoDescription?: string;
    Status?: boolean;
}