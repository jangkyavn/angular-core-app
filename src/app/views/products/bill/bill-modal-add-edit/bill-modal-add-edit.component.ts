import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, UtilityService, UploadService } from '../../../../services';
import { Bill } from '../../../../models/bill.model';
import { BillDetail } from '../../../../models/bill-detail.model';

@Component({
  selector: 'bill-modal-add-edit',
  templateUrl: './bill-modal-add-edit.component.html',
  styleUrls: ['./bill-modal-add-edit.component.scss']
})
export class BillModalAddEditComponent implements OnInit {
  @Output() saveChangesResult = new EventEmitter<boolean>(false);
  @ViewChild('billModalAddEdit') public billModalAddEdit: ModalDirective;

  maskPhone = ['+', '8', '4', ' ', /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  modalTitle: string;
  billForm: FormGroup;

  billStatuses: any[];
  paymentMethods: any[];
  colors: any[];
  sizes: any[];
  products: any[];
  billDetails: any[];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadBillStatus();
    this.loadPaymentMethod();
    this.loadColors();
    this.loadSizes();
    this.loadProducts();

    this.createForm();
  }

  createForm() {
    this.billForm = this.fb.group({
      Id: [''],
      CustomerName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      CustomerAddress: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
      CustomerMobile: ['', Validators.required],
      CustomerMessage: ['', Validators.maxLength(500)],
      PaymentMethod: ['', Validators.required],
      BillStatus: ['', Validators.required],
      DateCreated: [''],
      BillDetails: this.fb.array([this.initObjectBillDetail()])
    });
  }

  initObjectBillDetail() {
    return this.fb.group({
      Id: [0],
      BillId: [0],
      ProductId: ['', Validators.required],
      ColorId: ['', Validators.required],
      SizeId: ['', Validators.required],
      Quantity: [1, Validators.required],
      Price: [0, Validators.required]
    });
  }

  saveChanges() {
    let data: Bill = this.billForm.value;
    data.CustomerMobile = this.utilityService.formatPhoneNumber(data.CustomerMobile);

    if (data.Id === 0) {
      this.dataService.post('/api/Bill', JSON.stringify(data)).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.saveChangesResult.emit(true);
        } else {
          this.saveChangesResult.emit(false);
        }
      });
    } else {
      this.dataService.put('/api/Bill', data).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.saveChangesResult.emit(true);
        } else {
          this.saveChangesResult.emit(false);
        }
      });
    }
  }

  setDefaultBillDetails() {
    const control = <FormArray>this.billForm.controls['BillDetails'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }

    control.push(this.initObjectBillDetail());
  }

  deleteBillDetail(id: number) {
    const control = <FormArray>this.billForm.controls['BillDetails'];
    control.removeAt(id);
  }

  addNewLineBillDetail() {
    const control = <FormArray>this.billForm.controls['BillDetails'];
    control.push(this.initObjectBillDetail());
  }

  loadBillStatus() {
    this.dataService.get('/api/Bill/GetBillStatus').subscribe(data => {
      this.billStatuses = data;
    });
  }

  loadPaymentMethod() {
    this.dataService.get('/api/Bill/GetPaymentMethod').subscribe(data => {
      this.paymentMethods = data;
    });
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

  loadProducts() {
    this.dataService.get('/api/Product').subscribe(data => {
      this.products = data;
    });
  }

  showModal(title: string, id?: number) {
    this.modalTitle = title;
    this.billForm.reset();
    this.setDefaultBillDetails();

    if (id !== undefined) {
      this.dataService.get(`/api/Bill/${id}`).subscribe((response: any) => {
        let data: Bill = response;

        this.billForm.patchValue(data);

        const control = <FormArray>this.billForm.controls['BillDetails'];
        control.removeAt(0);

        data.BillDetails.forEach((item: BillDetail) => {
          let newGroup = this.fb.group({
            Id: [item.Id],
            BillId: [item.BillId],
            ProductId: [item.ProductId, Validators.required],
            ColorId: [item.ColorId, Validators.required],
            SizeId: [item.SizeId, Validators.required],
            Quantity: [item.Quantity, Validators.required],
            Price: [item.Price, Validators.required]
          });

          control.push(newGroup);
        });
      });
    } else {
      this.billForm.patchValue({
        Id: 0,
        PaymentMethod: '',
        BillStatus: '',
        BillDetails: [
          {
            Id: 0,
            BillId: 0,
            ProductId: '',
            ColorId: '',
            SizeId: '',
            Quantity: 1,
            Price: 0
          }
        ]
      });
    }

    this.billModalAddEdit.show();
  }

  hideModal() {
    this.billModalAddEdit.hide();
  }

  validateQuantity(index: number, event: any) {
    const control = <FormArray>this.billForm.controls['BillDetails'];
    let value = event.target.value;

    if (value === '' || isNaN(value) || value.indexOf('.') > -1) {
      control.controls[index].get('Quantity').setValue('1');
    }
  }
}