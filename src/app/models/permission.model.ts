export interface Permission {
    Id?: number;
    CanCreate?: boolean;
    CreateRead?: boolean;
    CreateUpdate?: boolean;
    CreateDelete?: boolean;
    FunctionId?: string;
    RoleId?: string;
}