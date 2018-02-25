import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { DataService, NotificationService, UtilityService } from '../../../../services';
import { WholePrice } from '../../../../models/whole-price.model';
import { MessageConstants } from '../../../../common';

export interface WholePriceForm {
  productId?: number;
  wholePrices: WholePrice[];
}

@Component({
  selector: 'product-modal-whole-price-management',
  templateUrl: './product-modal-whole-price-management.component.html',
  styleUrls: ['./product-modal-whole-price-management.component.scss']
})
export class ProductModalWholePriceManagementComponent implements OnInit {
  @ViewChild('productModalWholePriceManagement') productModalWholePriceManagement: ModalDirective;

  modalTitle: string;
  numberMask = createNumberMask({
    prefix: '',
    suffix: ' VNĐ'
  });

  wholePriceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.wholePriceForm = this.fb.group({
      productId: [0, Validators.required],
      wholePrices: this.fb.array([this.initObjectWholePrice()])
    });
  }

  initObjectWholePrice() {
    return this.fb.group({
      FromQuantity: [1, Validators.required],
      ToQuantity: [1, Validators.required],
      Price: ['0', Validators.required]
    });
  }

  saveChanges() {
    let data: WholePriceForm = this.wholePriceForm.value;
    const length = data.wholePrices.length;

    for (let i = 0; i < length; i++) {
      data.wholePrices[i].Price = this.utilityService.formatPrice(data.wholePrices[i].Price);
    }

    this.dataService.post('/api/Product/SaveWholePrices', data).subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.hideModal();
      }
    });
  }

  loadWholePrices(productId: number) {
    this.dataService.get(`/api/Product/GetWholePrices?productId=${productId}`).subscribe((data: WholePrice[]) => {
      if (data.length > 0) {
        const control = <FormArray>this.wholePriceForm.controls['wholePrices'];
        control.removeAt(0);

        data.forEach(item => {
          let newGroup = this.fb.group({
            FromQuantity: [item.FromQuantity, Validators.required],
            ToQuantity: [item.ToQuantity, Validators.required],
            Price: [item.Price, Validators.required],
          });

          control.push(newGroup);
        });
      }

      this.productModalWholePriceManagement.show();
    });
  }

  showModal(productId: number, productName: string) {
    this.modalTitle = productName;
    this.wholePriceForm.reset();
    this.wholePriceForm.patchValue({
      productId
    });
    this.setDefaultWholePrices();

    this.loadWholePrices(productId);
  }

  hideModal() {
    this.productModalWholePriceManagement.hide();
  }

  addNewLine() {
    const control = <FormArray>this.wholePriceForm.controls['wholePrices'];
    control.push(this.initObjectWholePrice());
  }

  delete(id: number) {
    const control = <FormArray>this.wholePriceForm.controls['wholePrices'];
    control.removeAt(id);
  }

  setDefaultWholePrices() {
    const control = <FormArray>this.wholePriceForm.controls['wholePrices'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }

    control.push(this.initObjectWholePrice());
  }

  validateFromQuantity(index: number, event: any) {
    const control = <FormArray>this.wholePriceForm.controls['wholePrices'];
    let value = event.target.value;

    if (value === '' || isNaN(value) || value.indexOf('.') > -1) {
      control.controls[index].get('FromQuantity').setValue('1');
    }
  }

  validateToQuantity(index: number, event: any) {
    const control = <FormArray>this.wholePriceForm.controls['wholePrices'];
    let value = event.target.value;

    if (value === '' || isNaN(value) || value.indexOf('.') > -1) {
      control.controls[index].get('ToQuantity').setValue('1');
    }
  }
  
  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }
}
