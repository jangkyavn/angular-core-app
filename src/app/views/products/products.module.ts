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
import { CKEditorModule } from 'ng2-ckeditor';
import { TextMaskModule } from 'angular2-text-mask';

import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';

import { ProductComponent } from './product/product.component';
import { ProductModalAddEditComponent } from './product/product-modal-add-edit/product-modal-add-edit.component';
import { ProductModalImportExcelComponent } from './product/product-modal-import-excel/product-modal-import-excel.component';
import { ProductModalQuantityManagementComponent } from './product/product-modal-quantity-management/product-modal-quantity-management.component';
import { ProductModalImageManagementComponent } from './product/product-modal-image-management/product-modal-image-management.component';

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
    CKEditorModule,
    TextMaskModule,
    LoadingSpinnerModule.forRoot()
  ],
  declarations: [
    ProductComponent,
    ProductModalAddEditComponent,
    ProductModalImportExcelComponent,
    ProductModalQuantityManagementComponent,
    ProductModalImageManagementComponent,
    ProductCategoryComponent,
    ProductCategoryModalAddEditComponent,
    BillComponent,
    BillModalAddEditComponent
  ]
})
export class ProductsModule { }
