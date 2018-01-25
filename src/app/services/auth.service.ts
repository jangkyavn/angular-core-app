import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx'

import { SystemConstants } from '../common/system.constants';
import { LoggedInUser } from '../models/logged-in-user.model';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient) { }

  login(data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${SystemConstants.BASE_API}/api/Account`, data, { headers })
      .pipe(catchError((error: any) => Observable.throw(error)));
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
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const userData = JSON.parse(window.atob(base64));

      user = new LoggedInUser(
        userData.fullName,
        userData.email,
        userData.avatar,
        userData.roles,
        userData.permissions);
    }
    else
      user = null;

    return user;
  }
}
