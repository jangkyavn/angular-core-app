import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthService, DataService, NotificationService, UtilityService, UploadService } from '../../../services';

import { SystemConstants, MessageConstants } from '../../../common';

import { PagedResult } from '../../../models/paged-result.model';
import { Product } from '../../../models/product.model';
import { ProductCategory } from '../../../models/product-category.model';

import { ProductModalAddEditComponent } from './product-modal-add-edit/product-modal-add-edit.component';
import { ProductModalImportExcelComponent } from './product-modal-import-excel/product-modal-import-excel.component';
import { ProductModalImageManagementComponent } from './product-modal-image-management/product-modal-image-management.component';
import { ProductModalQuantityManagementComponent } from './product-modal-quantity-management/product-modal-quantity-management.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('productModalAddEdit') productModalAddEdit: ProductModalAddEditComponent;
  @ViewChild('productModalImportExcel') productModalImportExcel: ProductModalImportExcelComponent;
  @ViewChild('productModalQuantityManagement') productModalQuantityManagement: ProductModalQuantityManagementComponent;
  @ViewChild('productModalImageManagement') productModalImageManagement: ProductModalImageManagementComponent;

  baseApi: string = SystemConstants.BASE_API;
  noImage: string = this.baseApi + '/uploaded/images/no_image.png';
  isLoading: boolean = false;

  products: Product[];
  productCategoryHierachies: ProductCategory[];

  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  firstRow: number;
  lastRow: number;

  filterKeyword: string = '';
  filterCategory: string = '';
  selectedAll: boolean;
  nothingSelected: boolean;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    if (this.authService.checkAccess('PRODUCT_LIST')) {
      this.loadData();
      this.loadProductCategoryHierachies();
    } else {
      this.utilityService.navigateToLogin();
    }
  }

  loadData() {
    this.isLoading = true;

    const url = `/api/Product/GetAllPaging?keyword=${this.filterKeyword}&categoryId=${this.filterCategory}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

    this.dataService.get(url).subscribe((response: any) => {
      this.isLoading = false;
      const data: PagedResult<Product> = response;

      this.products = data.Results;
      this.pageIndex = data.CurrentPage;
      this.pageSize = data.PageSize;
      this.totalRow = data.RowCount;
      this.pageCount = data.PageCount;
      this.firstRow = data.FirstRowOnPage;
      this.lastRow = data.LastRowOnPage;
    });

    this.nothingSelected = true;
    this.selectedAll = false;
    $('#chkAll').prop('indeterminate', false)
  }

  loadProductCategoryHierachies() {
    this.dataService.get('/api/ProductCategory/GetAllHierachy').subscribe(data => {
      this.productCategoryHierachies = data;
    });
  }

  showAddNew() {
    this.productModalAddEdit.showModal('Thêm mới thông tin sản phẩm');
  }

  importExcel() {
    this.productModalImportExcel.showModal();
  }

  exportExcel() {
    this.dataService.post('/api/Product/ExportExcel').subscribe((response: string) => {
      if (response !== '' && response !== undefined && response !== null) {
        window.location.href = response;
      }
    });
  }

  downloadTemplate() {
    window.location.href = this.baseApi + '/templates/ProductImportTemplate.xlsx';
  }

  showEdit(id: number) {
    this.productModalAddEdit.showModal('Sửa thông tin sản phẩm', id);
  }

  showQuantityManagement(id: number, name: string) {
    this.productModalQuantityManagement.showModal(id, name);
  }

  showImageManagement(id: number, name: string) {
    this.productModalImageManagement.showModal(id, name);
  }

  saveChanges(result: boolean) {
    if (result) {
      this.loadData();
      this.productModalAddEdit.hideModal();
      this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
    }
  }

  saveChangesImportExcel(result: boolean) {
    if (result) {
      this.loadData();
      this.productModalImportExcel.hideModal();
      this.notificationService.printSuccessMessage(MessageConstants.IMPORT_OK_MSG);
    }
  }

  saveChangesQuantities(result: boolean) {
    if (result) {
      this.productModalQuantityManagement.hideModal();
      this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
    }
  }

  saveChangesImages(result: boolean) {
    if (result) {
      this.productModalImageManagement.hideModal();
      this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
    }
  }

  delete(id: number) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.dataService.delete(`/api/Product/${id}`).subscribe(() => {
        this.loadData();
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      })
    })
  }

  public deleteMulti() {
    let checkedItems = this.products.filter(x => x.Selected);
    let checkedIds = [];

    for (let i = 0; i < checkedItems.length; i++) {
      checkedIds.push(checkedItems[i]['Id']);
    }

    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_SELECTED_MSG, () => {
      this.dataService.delete(`/api/Product/DeleteMulti?strIds=${JSON.stringify(checkedIds)}`).subscribe(() => {
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.loadData();
      });
    });
  }

  changeLengthMenu(event: any) {
    this.pageSize = event.target.value;

    this.loadData();
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;
    this.loadData();
  }

  selectAll() {
    for (var i = 0; i < this.products.length; i++) {
      this.products[i].Selected = this.selectedAll;
    }

    this.nothingSelected = true;
  }

  checkIfAllSelected() {
    this.selectedAll = this.products.every((item: Product) => {
      return item.Selected == true;
    });

    this.nothingSelected = this.products.every((item: Product) => {
      return item.Selected == false;
    });

    if (!this.selectedAll && !this.nothingSelected) {
      $('#chkAll').prop('indeterminate', true)
    } else {
      $('#chkAll').prop('indeterminate', false)
    }
  }
}