import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';

import { DataService, NotificationService, UtilityService } from '../../../services';
import { MessageConstants, SystemConstants } from '../../../common';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  @ViewChild('tree') reportsTree: TreeComponent;
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  modalTitle: string = '';
  seoAlias: string = '';
  baseApi: string = SystemConstants.BASE_API;
  urlImage: string = '';

  productCategoryForm: FormGroup;

  parentProductCategories: any[];
  productCategorySearchResult: any[];
  productCategories: any[];
  productCategoryHierarchies: any[];
  options = {};

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) { }

  ngOnInit() {
    this.loadData();
    this.createForm();

  }

  createForm() {
    this.productCategoryForm = this.fb.group({
      Id: [0],
      Name: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
      SeoAlias: [''],
      ParentId: [''],
      Image: [''],
      Description: ['', Validators.maxLength(500)],
      SortOrder: [0, [
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ]],
      SeoPageTitle: ['', Validators.maxLength(200)],
      SeoKeywords: ['', Validators.maxLength(200)],
      SeoDescription: ['', Validators.maxLength(200)],
      Status: [false]
    });
  }

  setDefaultValue() {
    this.productCategoryForm.patchValue({
      Id: 0,
      ParentId: '',
      SortOrder: 0
    });
  }

  loadData() {
    this.dataService.get('/api/ProductCategory').subscribe((data: any) => {
      this.productCategories = data;
      this.productCategorySearchResult = data;
      this.productCategoryHierarchies = this.utilityService.unflatten(data);
    })

    this.dataService.get('/api/ProductCategory/LoadParent').subscribe(data => {
      this.parentProductCategories = data;
    })
  }

  showModal(title: string) {
    this.modalTitle = title;
    this.seoAlias = '';
    this.modalAddEdit.show();
    this.productCategoryForm.reset();
  }

  hideModal() {
    this.loadData();
    this.modalAddEdit.hide();
  }

  showAddNew() {
    this.showModal('Thêm mới thông tin thể loại sản phẩm');
    this.setDefaultValue();
  }

  showEdit(id: number) {
    this.showModal('Sửa thông tin thể loại sản phẩm');

    this.dataService.get(`/api/ProductCategory/${id}`).subscribe((data: any) => {
      delete data['DateCreated'];
      delete data['DateModified'];
      delete data['Products'];
      this.seoAlias = data.SeoAlias;

      data.ParentId = (data.ParentId === null) ? '' : data.ParentId;

      this.productCategoryForm.setValue(data);
    });
  }

  onSubmitForm() {
    const data = this.productCategoryForm.value;
    data.SeoAlias = this.seoAlias;

    if (data.Id === 0) {
      this.dataService.post('/api/ProductCategory', data).subscribe(() => {
        this.hideModal();
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      });
    } else {
      this.dataService.put('/api/ProductCategory', data).subscribe(() => {
        this.hideModal();
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      });
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
    this.seoAlias = this.utilityService.makeSeoAlias(value);
  }
}
