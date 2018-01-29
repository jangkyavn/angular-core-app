import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService, UtilityService } from '../../../services';
import { SystemConstants, MessageConstants } from '../../../common';

import { PagedResult } from '../../../models/paged-result.model';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  modalTitle: string = '';
  baseApi: string = SystemConstants.BASE_API;

  entity: Product = {};

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
  filterCategoryId: any;
  selectedAll: any;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) { }

  ngOnInit() {
    this.loadData();
    this.loadProductCategoryHierachies();
  }

  loadData() {
    const url = `/api/Product/GetAllPaging?keyword=${this.filterKeyword}&categoryId=${this.filterCategoryId}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

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
  }

  loadProductCategoryHierachies() {
    this.dataService.get('/api/ProductCategory/GetAllHierachy').subscribe(data => {
      this.productCategoryHierachies = data;
    });
  }

  setDefaultValue() {
    let state = {};

    this.entity = {
      ...state,
      Id: 0,
      CategoryId: '',
      DateCreated: null,
      HotFlag: false,
      Status: false
    }
  }

  showModal(title: string, id?: number) {
    this.entity.SeoAlias = '';

    if (id !== undefined) {
      this.dataService.get(`/api/Product/${id}`).subscribe((data: any) => {
        this.entity = data;

        this.entity.CategoryId = (this.entity.CategoryId === null) ? '' : this.entity.CategoryId;
      });
    } else {
      this.setDefaultValue();
    }

    this.modalTitle = title;
    this.modalAddEdit.show();
  }

  hideModal(form: NgForm) {
    this.loadData();
    this.modalAddEdit.hide();
    form.resetForm();
  }

  showAddNew() {
    this.showModal('Thêm mới thông tin sản phẩm');
  }

  showEdit(id: number) {
    this.showModal('Sửa thông tin sản phẩm', id);
  }

  saveChanges(form: NgForm) {
    if (form.valid) {
      const data = this.entity;

      if (data.Id === 0) {
        this.dataService.post('/api/Product', data).subscribe(() => {
          this.hideModal(form);
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        });
      } else {
        this.dataService.put('/api/Product', data).subscribe(() => {
          this.hideModal(form);
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        });
      }
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

  makeSeoAlias(value: string) {
    this.entity.SeoAlias = this.utilityService.makeSeoAlias(value);
  }

  search(value: string) {
    this.filterKeyword = value;
    this.selectedAll = false;
    $('#customCheckAll').prop('indeterminate', false);
    this.loadData();
  }

  searchDropDown(value: string) {
    this.filterCategoryId = value;
    this.selectedAll = false;
    $('#customCheckAll').prop('indeterminate', false);
    this.loadData();
  }

  changeLengthMenu(value: number) {
    this.pageSize = value;
    this.selectedAll = false;
    $('#customCheckAll').prop('indeterminate', false);
    this.loadData();
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;
    this.selectedAll = false;
    $('#customCheckAll').prop('indeterminate', false);
    this.loadData();
  }

  selectAll() {
    for (var i = 0; i < this.products.length; i++) {
      this.products[i].Selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.products.every((item: any) => {
      return item.Selected == true;
    });

    let nothingSelected = this.products.every((item: any) => {
      return item.Selected == false;
    });

    if (!this.selectedAll && !nothingSelected) {
      $('#customCheckAll').prop('indeterminate', true);
    } else {
      $('#customCheckAll').prop('indeterminate', false);
    }
  }
}
