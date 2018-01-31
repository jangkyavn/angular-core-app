import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';

import { DataService, NotificationService, UtilityService, UploadService } from '../../../services';
import { MessageConstants, SystemConstants } from '../../../common';

import { ProductCategory } from '../../../models/product-category.model';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  @ViewChild('tree') reportsTree: TreeComponent;
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  modalTitle: string = '';
  baseApi: string = SystemConstants.BASE_API;
  imageUrl: string;

  entity: ProductCategory = {};

  parentProductCategories: any[];
  productCategorySearchResult: any[];
  productCategories: any[];
  productCategoryHierarchies: any[];
  options = {};

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.get('/api/ProductCategory').subscribe((data: any) => {
      this.productCategories = data;
      this.productCategorySearchResult = data;
      this.productCategoryHierarchies = this.utilityService.unflatten(data);
    })
  }

  setDefaultValue() {
    let state = {};

    this.entity = {
      ...state,
      Id: 0,
      ParentId: '',
      DateCreated: null,
      SortOrder: 0,
      Status: false
    }
  }

  showModal(title: string, id?: number) {
    this.entity.SeoAlias = '';
    this.imageUrl = '';

    if (id !== undefined) {
      this.dataService.get(`/api/ProductCategory/${id}`).subscribe((data: any) => {
        this.entity = data;
        this.imageUrl = this.entity.Image == null ? '' : this.baseApi + this.entity.Image;
        this.entity.ParentId = (this.entity.ParentId === null) ? '' : this.entity.ParentId;
      });
    } else {
      this.setDefaultValue();
    }

    this.dataService.get(`/api/ProductCategory/LoadParent/${id}`).subscribe(data => {
      this.parentProductCategories = data;
      this.modalTitle = title;
      this.modalAddEdit.show();
    })
  }

  hideModal(form: NgForm) {
    this.loadData();
    this.modalAddEdit.hide();
    $('#fileInputImage').val(null);
    form.resetForm();
  }

  showAddNew() {
    this.showModal('Thêm mới thông tin thể loại sản phẩm');
  }

  showEdit(id: number) {
    this.showModal('Sửa thông tin thể loại sản phẩm', id);
  }

  saveChanges(form: NgForm) {
    if (form.valid) {
      const data = this.entity;

      if (data.Id === 0) {
        this.dataService.post('/api/ProductCategory', JSON.stringify(data)).subscribe(() => {
          this.hideModal(form);
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        });
      } else {
        this.dataService.put('/api/ProductCategory', JSON.stringify(data)).subscribe(() => {
          this.hideModal(form);
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        });
      }
    }
  }

  delete(id: number) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.dataService.delete(`/api/ProductCategory/${id}`).subscribe(() => {
        this.loadData();
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      })
    })
  }

  search(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => this.utilityService.fuzzySearch(value, node.data.Name));

    this.productCategorySearchResult = this.productCategories.filter(data => {
      return data.Name.toLowerCase().includes(value.toLowerCase());
    });
  }

  makeSeoAlias(value: string) {
    this.entity.SeoAlias = this.utilityService.makeSeoAlias(value);
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
