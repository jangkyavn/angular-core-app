import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { DataService, NotificationService, UtilityService, UploadService } from '../../../../services';
import { Product } from '../../../../models/product.model';
import { SystemConstants } from '../../../../common/system.constants';
import { MessageConstants } from '../../../../common';

@Component({
  selector: 'product-modal-add-edit',
  templateUrl: './product-modal-add-edit.component.html',
  styleUrls: ['./product-modal-add-edit.component.scss']
})
export class ProductModalAddEditComponent implements OnInit {
  @Output() saveChangesResult = new EventEmitter<boolean>(false);
  @ViewChild('productModalAddEdit') public productModalAddEdit: ModalDirective;

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' VNĐ'
  });
  productForm: FormGroup;
  productCategoryHierachies: any[];

  tagItems: any[];
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
    this.loadProductCategoryHierachies();
  }

  loadProductCategoryHierachies() {
    this.dataService.get('/api/ProductCategory/GetAllHierachy').subscribe(data => {
      this.productCategoryHierachies = data;
    });
  }

  createForm() {
    this.productForm = this.fb.group({
      Id: [0],
      Name: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
      SeoAlias: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      CategoryId: ['', Validators.required],
      Description: ['', Validators.maxLength(500)],
      Content: [''],
      Image: ['', Validators.maxLength(250)],
      Price: [0, Validators.required],
      OriginalPrice: [0, Validators.required],
      PromotionPrice: [0],
      Unit: ['', Validators.maxLength(100)],
      Tags: [''],
      SeoPageTitle: ['', Validators.maxLength(200)],
      SeoKeywords: ['', Validators.maxLength(250)],
      SeoDescription: ['', Validators.maxLength(250)],
      DateCreated: [''],
      Status: [false, Validators.required],
      HotFlag: [false]
    });
  }

  saveChanges() {
    let data: Product = this.productForm.value;
    data.Tags = this.tagItems.length > 0 ? this.tagItems.toString() : null;
    data.Price = this.utilityService.formatPrice(data.Price);
    data.OriginalPrice = this.utilityService.formatPrice(data.OriginalPrice);
    data.PromotionPrice = this.utilityService.formatPrice(data.PromotionPrice);

    if (data.Id === 0) {
      this.dataService.post('/api/Product', data).subscribe(() => {
        this.saveChangesResult.emit(true);
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      });
    } else {
      this.dataService.put('/api/Product', data).subscribe(() => {
        this.saveChangesResult.emit(true);
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      });
    }
  }

  showModal(title: string, id?: number) {
    this.productForm.reset();
    this.modalTitle = title;
    this.imageUrl = '';
    this.seoAlias = '';
    $('#fileInputImage').val(null);

    if (id !== undefined) {
      this.dataService.get(`/api/Product/${id}`).subscribe((response: any) => {
        let data: Product = response;

        this.productForm.patchValue({
          ...data,
          ParentId: (data.CategoryId === null) ? '' : data.CategoryId
        });

        if (data.Tags !== null && data.Tags !== '') {
          const tagArr = data.Tags.split(',');

          this.tagItems = tagArr;
        }
        else {
          this.tagItems = [];
        }

        this.seoAlias = data.SeoAlias;
        this.imageUrl = data.Image == null ? '' : this.baseApi + data.Image;
      });
    } else {
      this.productForm.patchValue({
        Id: 0,
        CategoryId: '',
        HotFlag: 0,
        Status: 0
      });

      this.tagItems = [];
    }

    this.productModalAddEdit.show();
  }

  hideModal() {
    this.productModalAddEdit.hide();
  }

  btnSelectImage() {
    $('#fileInputImage').click();
  }

  changeFileInputImage(files: any) {
    this.uploadService.postWithFile('/api/Upload/UploadImage?type=products', null, files).then((imageUrl: string) => {
      this.productForm.patchValue({
        Image: imageUrl
      })

      this.imageUrl = imageUrl == '' ? '' : this.baseApi + imageUrl;
    })
  }

  makeSeoAlias(value: string) {
    let seoAlias = this.utilityService.makeSeoAlias(value);

    this.productForm.patchValue({
      SeoAlias: seoAlias
    });

    this.seoAlias = seoAlias;
  }
}
