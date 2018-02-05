import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing.module';

import { TreeModule } from 'angular-tree-component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TagInputModule } from 'ngx-chips';
import { CKEditorModule } from 'ng2-ckeditor';

import { ProductComponent } from './product/product.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductCategoryModalAddEditComponent } from './product-category/product-category-modal-add-edit/product-category-modal-add-edit.component';
import { ProductModalAddEditComponent } from './product/product-modal-add-edit/product-modal-add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    TreeModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    TagInputModule,
    CKEditorModule
  ],
  declarations: [
    ProductComponent,
    ProductCategoryComponent,
    ProductCategoryModalAddEditComponent,
    ProductModalAddEditComponent
  ]
})
export class ProductsModule { }
