import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService, UtilityService, UploadService } from '../../../services';
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
  imageUrl: string;
  noImage: string = this.baseApi + '/uploaded/images/no_image.png';

  entity: Product = {};
  tagItems: any[];
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
  filterGender: any;
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
    const url = `/api/Product/GetAllPaging?keyword=${this.filterKeyword}&gender=${this.filterGender}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

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
    $('#customCheckAll').prop('indeterminate', false);
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

    this.tagItems = [];
  }

  showModal(title: string, id?: number) {
    this.entity.SeoAlias = '';
    this.imageUrl = '';
    this.entity.Content = '';

    if (id !== undefined) {
      this.dataService.get(`/api/Product/${id}`).subscribe((data: any) => {
        this.entity = data;
        this.imageUrl = this.entity.Image == null ? '' : this.baseApi + this.entity.Image;

        if (this.entity.Tags !== null && this.entity.Tags !== '') {
          const tagArr = this.entity.Tags.split(',');

          this.tagItems = tagArr;
        }
        else {
          this.tagItems = [];
        }
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
    $('#fileInputImage').val(null);
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
      data.Tags = this.tagItems.toString();

      console.log(data);

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

  makeSeoAlias(value: string) {
    this.entity.SeoAlias = this.utilityService.makeSeoAlias(value);
  }

  search(value: string) {
    this.filterKeyword = value;
    this.loadData();
  }

  searchDropDown(value: any) {
    this.filterGender = value;
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
      $('#customCheckAll').prop('indeterminate', true);
    } else {
      $('#customCheckAll').prop('indeterminate', false);
    }
  }

  btnSelectImage() {
    $('#fileInputImage').click();
  }

  changeFileInputImage(files: any) {
    this.uploadService.postWithFile('/api/Upload/UploadImage?type=products', null, files).then((imageUrl: string) => {
      this.entity.Image = imageUrl;
      this.imageUrl = imageUrl == '' ? '' : this.baseApi + imageUrl;
    })
  }

  closeModal(form: NgForm) {
    this.modalAddEdit.hide(); 
    form.resetForm();
    $('#fileInputImage').val(null);
  }
}
