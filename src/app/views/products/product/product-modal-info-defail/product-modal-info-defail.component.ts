import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { Product } from '../../../../models/product.model';
import { SystemConstants } from '../../../../common';

@Component({
  selector: 'product-modal-info-defail',
  templateUrl: './product-modal-info-defail.component.html',
  styleUrls: ['./product-modal-info-defail.component.scss']
})
export class ProductModalInfoDefailComponent implements OnInit {
  @ViewChild('productModalInfoDetail') productModalInfoDetail: ModalDirective;
  baseApi: string;
  product: Product;
  tags: string[];

  constructor() { }

  ngOnInit() {
    this.baseApi = SystemConstants.BASE_API;
    this.tags = [];
  }

  showModal(data: Product) {
    this.product = data;
    this.tags = data.Tags == null ? [] : data.Tags.split(',');

    this.productModalInfoDetail.show();
  }

  hideModal() {
    this.productModalInfoDetail.hide();
  }
}
