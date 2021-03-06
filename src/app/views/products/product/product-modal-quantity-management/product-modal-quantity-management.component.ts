import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService, UtilityService } from '../../../../services';
import { ProductQuantity } from '../../../../models/product-quantity.model';
import { MessageConstants } from '../../../../common';

@Component({
  selector: 'product-modal-quantity-management',
  templateUrl: './product-modal-quantity-management.component.html',
  styleUrls: ['./product-modal-quantity-management.component.scss']
})
export class ProductModalQuantityManagementComponent implements OnInit {
  @ViewChild('productModalQuantityManagement') productModalQuantityManagement: ModalDirective;

  modalTitle: string;

  productQuantityForm: FormGroup;
  colors: any[];
  sizes: any[];
  products: any[];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadColors();
    this.loadSizes();

    this.createForm();
  }

  createForm() {
    this.productQuantityForm = this.fb.group({
      productId: [0, Validators.required],
      quantities: this.fb.array([this.initObjectQuantity()])
    });
  }

  initObjectQuantity() {
    return this.fb.group({
      ColorId: ['', Validators.required],
      SizeId: ['', Validators.required],
      Quantity: [1, Validators.required]
    });
  }

  saveChanges() {
    const data = this.productQuantityForm.value;

    this.dataService.post('/api/Product/SaveQuantities', data).subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.hideModal();
      }
    });
  }

  loadQuantities(productId: number) {
    this.dataService.get(`/api/Product/GetQuantities?productId=${productId}`).subscribe((data: ProductQuantity[]) => {
      if (data.length > 0) {
        const control = <FormArray>this.productQuantityForm.controls['quantities'];
        control.removeAt(0);

        data.forEach(item => {
          let newGroup = this.fb.group({
            ColorId: [item.ColorId, Validators.required],
            SizeId: [item.SizeId, Validators.required],
            Quantity: [item.Quantity, Validators.required],
          });

          control.push(newGroup);
        });
      }

      this.productModalQuantityManagement.show();
    });
  }

  showModal(productId: number, productName: string) {
    this.modalTitle = productName;
    this.productQuantityForm.reset();
    this.productQuantityForm.patchValue({
      productId
    });
    this.setDefaultQuantities();
    this.loadQuantities(productId);
  }

  hideModal() {
    this.productModalQuantityManagement.hide();
  }

  loadColors() {
    this.dataService.get('/api/Color').subscribe(data => {
      this.colors = data;
    });
  }

  loadSizes() {
    this.dataService.get('/api/Size').subscribe(data => {
      this.sizes = data;
    });
  }

  addNewLine() {
    const control = <FormArray>this.productQuantityForm.controls['quantities'];
    control.push(this.initObjectQuantity());
  }

  delete(id: number) {
    const control = <FormArray>this.productQuantityForm.controls['quantities'];
    control.removeAt(id);
  }

  setDefaultQuantities() {
    const control = <FormArray>this.productQuantityForm.controls['quantities'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }

    control.push(this.initObjectQuantity());
  }

  validateQuantity(index: number, event: any) {
    const control = <FormArray>this.productQuantityForm.controls['quantities'];
    let value = event.target.value;

    if (value === '' || isNaN(value) || value.indexOf('.') > -1) {
      control.controls[index].get('Quantity').setValue('1');
    }
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }
}
