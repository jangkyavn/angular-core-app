export interface ProductCategory { 
    Id: number;
    Name: string;
    SeoAlias: string;
    ParentId?: number;
    Description: string;
    Image: string;
    SortOrder: number;
    SeoPageTitle: string;
    SeoKeywords: string;
    SeoDescription: string;
    Status: number;
}