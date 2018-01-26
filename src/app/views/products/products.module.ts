import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing.module';

import { TreeModule } from 'angular-tree-component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ProductComponent } from './product/product.component';
import { ProductCategoryComponent } from './product-category/product-category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    TreeModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ProductComponent,
    ProductCategoryComponent
  ]
})
export class ProductsModule { }
