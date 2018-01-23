import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { SystemConstants } from '../common/system.constants';
import { LoggedInUser } from '../models/logged-in-user.model';
import { DataService } from './data.service';
import { UtilityService } from './utility.service';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private utilityService: UtilityService) { }

  login(data: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.dataService.post('/api/account/login', JSON.stringify(data))
      .pipe(tap((result: any) => {
        if (result && result.token) {
          const user = this.utilityService.parseTokenBase(result);

          localStorage.removeItem(SystemConstants.CURRENT_USER);
          localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
        }
      }));
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
  }

  isUserAuthenticated(): boolean {
    const user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user !== null) {
      return true;
    }
    else
      return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser;
    if (this.isUserAuthenticated()) {
      const userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      user = new LoggedInUser(
        userData.access_token,
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
