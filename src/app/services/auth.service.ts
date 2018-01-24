import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { SystemConstants } from '../common/system.constants';
import { LoggedInUser } from '../models/logged-in-user.model';
import { UtilityService } from './utility.service';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService) { }

  login(data: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('/api/account/login', JSON.stringify(data), { headers })
      .pipe(tap((result: any) => {
        if (result && result.token) {
          localStorage.removeItem(SystemConstants.ACCESS_TOKEN);
          localStorage.setItem(SystemConstants.ACCESS_TOKEN, result.token);
        }
      }));
  }

  logout() {
    localStorage.removeItem(SystemConstants.ACCESS_TOKEN);
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
      const userData = this.utilityService.parseToken(token);

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
