import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService, UtilityService, UploadService } from '../../../services';
import { SystemConstants, MessageConstants } from '../../../common';

import { PagedResult } from '../../../models/paged-result.model';
import { Product } from '../../../models/product.model';

import { ProductModalAddEditComponent } from './product-modal-add-edit/product-modal-add-edit.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('productModalAddEdit') productModalAddEdit: ProductModalAddEditComponent;

  baseApi: string = SystemConstants.BASE_API;
  noImage: string = this.baseApi + '/uploaded/images/no_image.png';

  products: any[];
  productCategoryHierachies: any[];

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
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService) { }

  ngOnInit() {
    this.loadData();
    this.loadProductCategoryHierachies();
  }

  loadData() {
    const url = `/api/Product/GetAllPaging?keyword=${this.filterKeyword}&categoryId=${this.filterCategory}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

    this.dataService.get(url).subscribe((response: any) => {
      const data: PagedResult = response;

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

  showEdit(id: number) {
    this.productModalAddEdit.showModal('Sửa thông tin sản phẩm', id);
  }

  saveChanges(result: boolean) {
    if (result) {
      this.loadData();
      this.productModalAddEdit.hideModal();
      this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
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

  search(value: string) {
    this.filterKeyword = value;
    this.loadData();
  }

  searchDropDown(value: any) {
    this.filterCategory = value;
    this.loadData();
  }

  changeLengthMenu(value: number) {
    this.pageSize = value;
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
    this.selectedAll = this.products.every((item: any) => {
      return item.Selected == true;
    });

    this.nothingSelected = this.products.every((item: any) => {
      return item.Selected == false;
    });

    if (!this.selectedAll && !this.nothingSelected) {
      $('#chkAll').prop('indeterminate', true)
    } else {
      $('#chkAll').prop('indeterminate', false)
    }
  }
}