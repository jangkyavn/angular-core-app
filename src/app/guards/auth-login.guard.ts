import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UtilityService } from '../services/utility.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthLoginGuard implements CanActivate {
  constructor(private utilityService: UtilityService, private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isUserAuthenticated()) {
      this.utilityService.navigate('/');

      return false;
    }

    return true;
  }
}
