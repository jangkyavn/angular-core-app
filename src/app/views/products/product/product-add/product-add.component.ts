import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { DataService, NotificationService, UtilityService, UploadService } from '../../../../services';
import { Product } from '../../../../models/product.model';
import { SystemConstants } from '../../../../common/system.constants';
import { MessageConstants } from '../../../../common';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  froalaOptions: Object = {
    language: 'vi',
    height: 300,
    theme: 'gray'
  };
  numberMask = createNumberMask({
    prefix: '',
    suffix: ' VNĐ'
  });
  productAddForm: FormGroup;
  productCategoryHierachies: any[];

  tagItems: any[];
  baseApi: string;
  imageUrl: string;
  seoAlias: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public location: Location,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.tagItems = [];
    this.baseApi = SystemConstants.BASE_API;
    this.imageUrl = '';
    this.seoAlias = '';

    this.createForm();
    this.loadProductCategoryHierachies();
  }

  createForm() {
    this.productAddForm = this.fb.group({
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

  loadProductCategoryHierachies() {
    this.dataService.get('/api/ProductCategory/GetAllHierachy').subscribe(data => {
      this.productCategoryHierachies = data;
    });
  }

  saveChanges() {
    let data: Product = this.productAddForm.value;
    data.Tags = this.tagItems.length > 0 ? this.tagItems.toString() : null;
    data.Price = this.utilityService.formatPrice(data.Price);
    data.OriginalPrice = this.utilityService.formatPrice(data.OriginalPrice);
    data.PromotionPrice = this.utilityService.formatPrice(data.PromotionPrice);

    this.dataService.post('/api/Product', data).subscribe((response: any) => {
      if (response !== null && response !== undefined) {
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        this.location.back();
      }
    });
  }

  changeFileImage(files: any) {
    this.uploadService.postWithFile('/api/Upload/UploadImage?type=products', null, files).then((imageUrl: string) => {
      this.productAddForm.patchValue({
        Image: imageUrl
      })

      this.imageUrl = imageUrl == '' ? '' : this.baseApi + imageUrl;
    })
  }

  makeSeoAlias(value: string) {
    let seoAlias = this.utilityService.makeSeoAlias(value);

    this.productAddForm.patchValue({
      SeoAlias: seoAlias
    });

    this.seoAlias = seoAlias;
  }
}
