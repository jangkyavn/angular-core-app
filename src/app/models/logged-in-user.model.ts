import { Permission } from '../models/permission.model';

export class LoggedInUser {
    public fullName?: string;
    public email?: string;
    public avatar?: string;
    public roles?: string;
    public permissions?: any;

    constructor(fullName: string, email: string, avatar: string, roles: string, permissions: any) {
        this.fullName = fullName;
        this.email = email;
        this.avatar = avatar;
        this.roles = roles;
        this.permissions = permissions;
    }
}