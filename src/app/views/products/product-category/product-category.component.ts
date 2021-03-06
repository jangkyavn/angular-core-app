import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';

import { AuthService, DataService, NotificationService, UtilityService, UploadService } from '../../../services';
import { MessageConstants, SystemConstants } from '../../../common';
import { ProductCategory } from '../../../models/product-category.model';
import { ProductCategoryModalAddEditComponent } from './product-category-modal-add-edit/product-category-modal-add-edit.component';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  @ViewChild('tree') reportsTree: TreeComponent;
  @ViewChild('productCategoryModalAddEdit') productCategoryModalAddEdit: ProductCategoryModalAddEditComponent;

  productCategories: ProductCategory[];
  productCategorySearchResult: any[];
  productCategoryHierarchies: any[];
  options = {};
  isLoading: boolean = false;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    if (this.authService.checkAccess('PRODUCT_CATEGORY')) {
      this.loadData();
    } else {
      this.utilityService.navigateToLogin();
    }
  }

  loadData() {
    this.isLoading = true;
    this.dataService.get('/api/ProductCategory').subscribe((data: any) => {
      this.isLoading = false;
      
      this.productCategories = data;
      this.productCategorySearchResult = data;
      this.productCategoryHierarchies = this.utilityService.unflatten(data);
    })
  }

  showAddNew() {
    this.productCategoryModalAddEdit.showModal('Thêm mới thông tin thể loại sản phẩm');
  }

  showEdit(id: number) {
    this.productCategoryModalAddEdit.showModal('Sửa thông tin thể loại sản phẩm', id);
  }

  saveChanges(result: boolean) {
    if (result) {
      this.loadData();
      this.productCategoryModalAddEdit.hideModal();
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
}
