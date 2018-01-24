import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { SystemConstants } from 'app/common/system.constants';
import { MessageConstants } from 'app/common/message.constants';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]]
    });
  }

  onSubmitForm() {
    const data = this.loginForm.value;

    this.spinnerService.show();

    this.authService.login(data).subscribe(data => {
      localStorage.removeItem(SystemConstants.ACCESS_TOKEN);
      localStorage.setItem(SystemConstants.ACCESS_TOKEN, data.token);

      this.spinnerService.hide();
      this.utilityService.navigate('/');
    }, err => {
      console.log(err);
      this.notificationService.printErrorMessage(err.error);
      this.spinnerService.hide();
    })
  }
}
