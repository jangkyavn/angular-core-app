import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { TreeModel, TreeNode } from 'angular-tree-component';

import { DataService, NotificationService, UtilityService } from '../../../services';
import { MessageConstants, SystemConstants } from '../../../common';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  modalTitle: string = '';
  seoAlias: string = '';
  baseApi: string = SystemConstants.BASE_API;
  urlImage: string = '';

  productCategoryForm: FormGroup;

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
      ParentId: [0],
      Image: [''],
      Description: ['', Validators.maxLength(500)],
      SortOrder: [0, [
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ]],
      SeoPageTitle: ['', Validators.maxLength(200)],
      SeoKeywords: ['', Validators.maxLength(200)],
      SeoDescription: ['', Validators.maxLength(200)],
      Status: [true]
    });
  }

  loadData() {
    this.dataService.get('/api/ProductCategory').subscribe((data: any) => {
      this.productCategories = data;
      this.productCategoryHierarchies = this.utilityService.unflatten(data);
    })
  }

  showAddNew() {
    this.modalTitle = 'Thêm mới thông tin thể loại sản phẩm';
    this.seoAlias = '';
    this.modalAddEdit.show();
    this.productCategoryForm.reset();
  }

  showEdit(id: number) {
    this.modalTitle = 'Sửa thông tin quyền';
    this.seoAlias = '';
    this.modalAddEdit.show();
    this.productCategoryForm.reset();

  }

  search(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => this.utilityService.fuzzySearch(value, node.data.Name));
  }

  makeSeoAlias(value: string) {
    this.seoAlias = this.utilityService.makeSeoAlias(value);
  }
}
