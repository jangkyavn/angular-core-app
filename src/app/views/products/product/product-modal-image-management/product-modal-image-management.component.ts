import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService, UtilityService } from '../../../../services';
import { ProductImage } from '../../../../models/product-image.model';
import { SystemConstants, MessageConstants } from '../../../../common';

export interface ImageManagement {
  productId?: number;
  images?: ProductImage[];
}

@Component({
  selector: 'product-modal-image-management',
  templateUrl: './product-modal-image-management.component.html',
  styleUrls: ['./product-modal-image-management.component.scss']
})
export class ProductModalImageManagementComponent implements OnInit {
  @ViewChild('productModalImageManagement') productModalImageManagement: ModalDirective;

  baseUrl = SystemConstants.BASE_API;
  modalTitle: string;
  imageManagement: ImageManagement;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.imageManagement = {};
  }

  saveChanges() {
    let data = this.imageManagement;

    this.dataService.post('/api/Product/SaveImages', data).subscribe((response: any) => {
      if (response !== undefined || response !== null) {
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.hideModal();
      }
    });
  }

  showModal(productId: number, productName: string) {
    this.imageManagement = {};
    this.imageManagement.productId = productId;
    this.modalTitle = productName;

    this.dataService.get(`/api/Product/GetImages?productId=${productId}`).subscribe((data: ProductImage[]) => {
      this.imageManagement.images = data;
    });

    this.productModalImageManagement.show();
  }

  hideModal() {
    this.productModalImageManagement.hide();
  }

  deleteAll() {
    this.imageManagement.images = [];
  }

  delete(index: number) {
    this.imageManagement.images.splice(index, 1);
  }

  changeImageFiles(event: any) {
    const files = event.target.files;

    let data = new FormData();

    for (var i = 0; i < files.length; i++) {
      data.append(files[i].name, files[i]);
    }

    this.dataService.postFile('/api/Upload/UploadImages?type=products', data).subscribe((data: string[]) => {
      for (let item of data) {
        let caption = this.utilityService.getCaptionFromPath(item);

        let checkExists = this.imageManagement.images.filter(x => {
          return x.Path == item && x.Caption == caption;
        }).length > 0 ? true : false;

        if (checkExists) {
          this.notificationService.printWarningMessage(MessageConstants.EXISTED_IMAGE);
        } else {
          this.imageManagement.images.push({
            Path: item,
            Caption: caption
          });
        }
      }
    });
  }
}
