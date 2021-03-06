import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';

// Import services
import * as fromServices from './services';

// Import guards
import * as fromGuards from './guards';

// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV,
  DialogConfirmComponent
} from './components';

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV,
  DialogConfirmComponent
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES
  ],
  entryComponents: [DialogConfirmComponent],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, ...fromServices.services, ...fromGuards.guards],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
