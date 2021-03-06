// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { RoleComponent } from './role/role.component';
import { DropdownMultiselectComponent } from '../../components/dropdown-multiselect/dropdown-multiselect.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Forms Component
import { FormsComponent } from './forms.component';

import { SwitchesComponent } from './switches.component';
import { TablesComponent } from './tables.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsComponent } from './tabs.component';

// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselsComponent } from './carousels.component';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CollapsesComponent } from './collapses.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoversComponent } from './popovers.component';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationsComponent } from './paginations.component';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ProgressComponent } from './progress.component';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TooltipsComponent } from './tooltips.component';

import { TextMaskModule } from 'angular2-text-mask';

import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';

// Components Routing
import { SystemsRoutingModule } from './systems-routing.module';
import { RoleModalAddEditComponent } from './role/role-modal-add-edit/role-modal-add-edit.component';
import { RoleModalPermissionComponent } from './role/role-modal-permission/role-modal-permission.component';

import { UserComponent } from './user/user.component';
import { UserModalAddEditComponent } from './user/user-modal-add-edit/user-modal-add-edit.component';
import { UserModalInfoDetailComponent } from './user/user-modal-info-detail/user-modal-info-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SystemsRoutingModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    TextMaskModule,
    LoadingSpinnerModule.forRoot()
  ],
  declarations: [
    RoleComponent,
    DropdownMultiselectComponent,
    FormsComponent,
    SwitchesComponent,
    TablesComponent,
    TabsComponent,
    CarouselsComponent,
    CollapsesComponent,
    PaginationsComponent,
    PopoversComponent,
    ProgressComponent,
    TooltipsComponent,
    RoleModalAddEditComponent,
    RoleModalPermissionComponent,
    UserComponent,
    UserModalAddEditComponent,
    UserModalInfoDetailComponent
  ]
})
export class SystemsModule { }
