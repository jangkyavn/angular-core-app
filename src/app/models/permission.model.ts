export interface Permission {
    Id?: number;
    CanCreate?: boolean;
    CanRead?: boolean;
    CanUpdate?: boolean;
    CanDelete?: boolean;
    FunctionId?: string;
    RoleId?: string;
}