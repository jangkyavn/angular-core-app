export interface User {
    Id?: number;
    FullName?: string;
    Password?: string;
    Email?: string;
    Gender?: any;
    BirthDay?: any;
    Address?: string;
    Avatar?: string;
    PhoneNumber?: string;
    DateCreated?: any,
    DateModified?: any,
    Roles: any[],
    Selected: boolean;
    Status?: boolean;
}