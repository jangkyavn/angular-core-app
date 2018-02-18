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
import { NgxSpinnerModule } from 'ngx-spinner';

import { ProductComponent } from './product/product.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { BillComponent } from './bill/bill.component';

import { ProductCategoryModalAddEditComponent } from './product-category/product-category-modal-add-edit/product-category-modal-add-edit.component';
import { ProductModalAddEditComponent } from './product/product-modal-add-edit/product-modal-add-edit.component';
import { ProductModalImportExcelComponent } from './product/product-modal-import-excel/product-modal-import-excel.component';
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
    NgxSpinnerModule
  ],
  declarations: [
    ProductComponent,
    ProductCategoryComponent,
    BillComponent,    
    ProductCategoryModalAddEditComponent,
    ProductModalAddEditComponent,
    ProductModalImportExcelComponent,
    BillModalAddEditComponent
  ]
})
export class ProductsModule { }
