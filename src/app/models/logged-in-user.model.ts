export class LoggedInUser {
    public id: string;
    public access_token: string;
    public fullName: string;
    public email: string;
    public avatar: string;
    public permissions:any;
    public roles: any;

    constructor(access_token: string, fullName: string, email: string, avatar: string, roles: any, permissions: any) {
        this.access_token = access_token;
        this.fullName = fullName;
        this.email = email;
        this.avatar = avatar;
        this.roles = roles;
        this.permissions = permissions;
    }
}