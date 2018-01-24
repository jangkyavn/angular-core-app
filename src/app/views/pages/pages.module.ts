import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent
  ]
})
export class PagesModule { }
