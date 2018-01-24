import { Component, OnInit } from '@angular/core';

import { UtilityService } from '../../services/utility.service';
import { AuthService } from 'app/services';

import { SystemConstants } from 'app/common/system.constants';

import { LoggedInUser } from '../../models/logged-in-user.model';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit {
  public user: LoggedInUser;

  constructor(private utilityService: UtilityService, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
  }

  logout(event: any) {
    event.preventDefault();

    localStorage.removeItem(SystemConstants.ACCESS_TOKEN);

    this.utilityService.navigateToLogin();
  }
}
