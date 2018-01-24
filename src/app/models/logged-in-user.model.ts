export class LoggedInUser {
    public fullName: string;
    public email: string;
    public avatar: string;
    public permissions:any;
    public roles: any;

    constructor(fullName: string, email: string, avatar: string, roles: any, permissions: any) {
        this.fullName = fullName;
        this.email = email;
        this.avatar = avatar;
        this.roles = roles;
        this.permissions = permissions;
    }
}