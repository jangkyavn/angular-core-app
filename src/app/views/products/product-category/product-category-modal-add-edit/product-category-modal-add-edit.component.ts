import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService, UtilityService, UploadService } from '../../../../services';
import { ProductCategory } from '../../../../models/product-category.model';
import { SystemConstants } from '../../../../common/system.constants';
import { MessageConstants } from '../../../../common';

@Component({
  selector: 'product-category-modal-add-edit',
  templateUrl: './product-category-modal-add-edit.component.html',
  styleUrls: ['./product-category-modal-add-edit.component.scss']
})
export class ProductCategoryModalAddEditComponent implements OnInit {
  @Output() saveChangesResult = new EventEmitter<boolean>(false);
  @ViewChild('productCategoryModalAddEdit') public productCategoryModalAddEdit: ModalDirective;

  productCategoryForm: FormGroup;
  parentProductCategories: ProductCategory[];

  baseApi: string = SystemConstants.BASE_API;
  modalTitle: string;
  imageUrl: string;
  seoAlias: string;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.productCategoryForm = this.fb.group({
      Id: [0],
      Name: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      SeoAlias: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      ParentId: [''],
      Description: ['', Validators.maxLength(500)],
      Image: ['', Validators.maxLength(250)],
      SortOrder: [0, Validators.required],
      SeoPageTitle: ['', Validators.maxLength(100)],
      SeoKeywords: ['', Validators.maxLength(250)],
      SeoDescription: ['', Validators.maxLength(250)],
      DateCreated: [''],
      Status: [false, Validators.required]
    });
  }

  saveChanges() {
    const data: ProductCategory = this.productCategoryForm.value;

    if (data.Id === 0) {
      this.dataService.post('/api/ProductCategory', data).subscribe(() => {
        this.saveChangesResult.emit(true);
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      });
    } else {
      this.dataService.put('/api/ProductCategory', data).subscribe(() => {
        this.saveChangesResult.emit(true);
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      });
    }
  }

  showModal(title: string, id?: number) {
    this.productCategoryForm.reset();
    this.modalTitle = title;
    this.imageUrl = '';
    this.seoAlias = '';
    $('#fileInputImage').val(null);

    this.dataService.get(`/api/ProductCategory/LoadParent/${id}`).subscribe(data => {
      this.parentProductCategories = data;
    })

    if (id !== undefined) {
      this.dataService.get(`/api/ProductCategory/${id}`).subscribe((response: any) => {
        let data: ProductCategory = response;

        this.productCategoryForm.patchValue({
          ...data,
          ParentId: (data.ParentId === null) ? '' : data.ParentId
        });

        this.seoAlias = data.SeoAlias;
        this.imageUrl = data.Image == null ? '' : this.baseApi + data.Image;
      });
    } else {
      this.productCategoryForm.patchValue({
        Id: 0,
        ParentId: '',
        SortOrder: 0,
        Status: 0
      });
    }

    this.productCategoryModalAddEdit.show();
  }

  hideModal() {
    this.productCategoryModalAddEdit.hide();
  }

  btnSelectImage() {
    $('#fileInputImage').click();
  }

  changeFileInputImage(files: any) {
    this.uploadService.postWithFile('/api/Upload/UploadImage?type=products', null, files).then((imageUrl: string) => {
      this.productCategoryForm.patchValue({
        Image: imageUrl
      })

      this.imageUrl = imageUrl == '' ? '' : this.baseApi + imageUrl;
    })
  }

  makeSeoAlias(value: string) {
    let seoAlias = this.utilityService.makeSeoAlias(value);

    this.productCategoryForm.patchValue({
      SeoAlias: seoAlias
    });

    this.seoAlias = seoAlias;
  }
}