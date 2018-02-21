import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, UtilityService } from '../../../../services';
import { ProductQuantity } from '../../../../models/product-quantity.model';

@Component({
  selector: 'product-modal-quantity-management',
  templateUrl: './product-modal-quantity-management.component.html',
  styleUrls: ['./product-modal-quantity-management.component.scss']
})
export class ProductModalQuantityManagementComponent implements OnInit {
  @Output() saveChangesResult = new EventEmitter<boolean>(false);
  @ViewChild('productModalQuantityManagement') productModalQuantityManagement: ModalDirective;

  modalTitle: string;

  quantityManagementForm: FormGroup;
  colors: any[];
  sizes: any[];
  products: any[];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadColors();
    this.loadSizes();

    this.createForm();
  }

  createForm() {
    this.quantityManagementForm = this.fb.group({
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
    const data = this.quantityManagementForm.value;

    console.log(data);
    this.dataService.post('/api/Product/SaveQuantities', data).subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.saveChangesResult.emit(true);
      } else {
        this.saveChangesResult.emit(false);
      }
    });
  }

  loadQuantities(productId: number) {
    this.dataService.get(`/api/Product/GetQuantities?productId=${productId}`).subscribe((data: ProductQuantity[]) => {
      if (data.length > 0) {
        const control = <FormArray>this.quantityManagementForm.controls['quantities'];
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
    this.quantityManagementForm.reset();
    this.quantityManagementForm.patchValue({
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
    const control = <FormArray>this.quantityManagementForm.controls['quantities'];
    control.push(this.initObjectQuantity());
  }

  delete(id: number) {
    const control = <FormArray>this.quantityManagementForm.controls['quantities'];
    control.removeAt(id);
  }

  setDefaultQuantities() {
    const control = <FormArray>this.quantityManagementForm.controls['quantities'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }

    control.push(this.initObjectQuantity());
  }

  validateQuantity(index: number, event: any) {
    const control = <FormArray>this.quantityManagementForm.controls['quantities'];
    let value = event.target.value;

    if (value === '' || isNaN(value) || value.indexOf('.') > -1) {
      control.controls[index].get('Quantity').setValue('1');
    }
  }
}
