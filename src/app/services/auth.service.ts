import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx'

import { UtilityService } from './utility.service';

import { SystemConstants } from '../common/system.constants';
import { LoggedInUser } from '../models/logged-in-user.model';
import { Permission } from '../models/permission.model';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }

  login(data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${SystemConstants.BASE_API}/api/Account`, data, { headers })
      .pipe(catchError((error: any) => Observable.throw(error)));
  }

  logout() {
    localStorage.removeItem(SystemConstants.ACCESS_TOKEN);
    this.utilityService.navigateToLogin();
  }

  isUserAuthenticated(): boolean {
    const token = localStorage.getItem(SystemConstants.ACCESS_TOKEN);
    if (token !== null) {
      return true;
    }
    else
      return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser;
    if (this.isUserAuthenticated()) {
      const token = localStorage.getItem(SystemConstants.ACCESS_TOKEN);
      const permissions: Permission[] = JSON.parse(localStorage.getItem(SystemConstants.PERMISSONS));
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const userData = JSON.parse(window.atob(base64));

      user = new LoggedInUser(
        userData.fullName,
        userData.email,
        userData.avatar,
        userData.roles,
        permissions);
    }
    else
      user = null;

    return user;
  }

  checkAccess(functionId: string) {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var permission: Permission[] = user.permissions;
    var roles: string[] = user.roles.split(';');
    var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanRead == true);
    if (hasPermission !== -1 || roles.findIndex(x => x === "Admin") !== -1) {
      return true;
    }
    else
      return false;
  }

  hasPermission(functionId: string, action: string): boolean {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var permission: Permission[] = user.permissions;
    var roles: string[] = user.roles.split(';');
    switch (action) {
      case 'create':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanCreate == true);
        if (hasPermission !== -1 || roles.findIndex(x => x === "Admin") !== -1)
          result = true;
        break;
      case 'update':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanUpdate == true);
        if (hasPermission !== -1 || roles.findIndex(x => x === "Admin") !== -1)
          result = true;
        break;
      case 'delete':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanDelete == true);
        if (hasPermission !== -1 || roles.findIndex(x => x === "Admin") !== -1)
          result = true;
        break;
    }
    return result;
  }
}
