import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing.module';

import { TreeModule } from 'angular-tree-component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TagInputModule } from 'ngx-chips';
import { TextMaskModule } from 'angular2-text-mask';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';

import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product/product-add/product-add.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { ProductModalImportExcelComponent } from './product/product-modal-import-excel/product-modal-import-excel.component';
import { ProductModalQuantityManagementComponent } from './product/product-modal-quantity-management/product-modal-quantity-management.component';
import { ProductModalImageManagementComponent } from './product/product-modal-image-management/product-modal-image-management.component';
import { ProductModalWholePriceManagementComponent } from './product/product-modal-whole-price-management/product-modal-whole-price-management.component';

import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductCategoryModalAddEditComponent } from './product-category/product-category-modal-add-edit/product-category-modal-add-edit.component';

import { BillComponent } from './bill/bill.component';
import { BillModalAddEditComponent } from './bill/bill-modal-add-edit/bill-modal-add-edit.component';

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
    BsDatepickerModule.forRoot(),
    TagInputModule,
    TextMaskModule,
    LoadingSpinnerModule.forRoot(),
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot()
  ],
  declarations: [
    ProductComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductModalImportExcelComponent,
    ProductModalQuantityManagementComponent,
    ProductModalImageManagementComponent,
    ProductModalWholePriceManagementComponent,    
    ProductCategoryComponent,
    ProductCategoryModalAddEditComponent,
    BillComponent,
    BillModalAddEditComponent
  ]
})
export class ProductsModule { }
