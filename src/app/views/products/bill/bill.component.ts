import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';

import { BillModalAddEditComponent } from './bill-modal-add-edit/bill-modal-add-edit.component';

import { AuthService, DataService, NotificationService, UtilityService, UploadService } from '../../../services';
import { MessageConstants, SystemConstants } from '../../../common';
import { PagedResult } from '../../../models/paged-result.model';
import { Bill } from '../../../models/bill.model';
import { Enum } from '../../../models/enum.model';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  @ViewChild('billModalAddEdit') billModalAddEdit: BillModalAddEditComponent;

  startDate?: Date = new Date(new Date().getUTCFullYear() - 1, new Date().getUTCMonth(), new Date().getUTCDate());
  endDate?: Date = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate());
  bsRangeValue: any = [this.startDate, this.endDate];
  maxDate = this.endDate;
  bsConfig: Partial<BsDaterangepickerConfig> = {
    containerClass: 'theme-dark-blue',
    rangeInputFormat: 'DD/MM/YYYY'
  };

  bills: Bill[];

  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  firstRow: number;
  lastRow: number;

  filterKeyword?: string;
  selectedAll: boolean;
  nothingSelected: boolean;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.filterKeyword = '';
    const startDate = this.utilityService.dateFormatJson2(this.startDate);
    const endDate = this.utilityService.dateFormatJson2(this.endDate);
    const url = `/api/Bill/GetAllPaging?startDate=${startDate}&endDate=${endDate}&keyword=${this.filterKeyword}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

    this.dataService.get(url).subscribe((response: any) => {
      const data: PagedResult<Bill> = response;
      this.bills = this.bills || [];

      for (let item of data.Results) {
        this.bills.push({
          ...item,
          BillStatusName: this.getBillStatusName(item.BillStatus),
          PaymentMethodName: this.getPaymentMethodName(item.PaymentMethod)
        });
      }

      this.pageIndex = data.CurrentPage;
      this.pageSize = data.PageSize;
      this.totalRow = data.RowCount;
      this.pageCount = data.PageCount;
      this.firstRow = data.FirstRowOnPage;
      this.lastRow = data.LastRowOnPage;
    });

    this.nothingSelected = true;
    this.selectedAll = false;
    $('#chkAll').prop('indeterminate', false)
  }

  saveChanges(result: boolean) {
    if (result) {
      this.loadData();
      this.billModalAddEdit.hideModal();
      this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
    } else {
      this.billModalAddEdit.hideModal();
    }
  }

  showAddNew() {
    this.billModalAddEdit.showModal('Thêm mới thông tin hóa đơn');
  }

  getBillStatusName(value: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.dataService.get('/api/Bill/GetBillStatus').subscribe((data: Enum[]) => {
        const name = data.find(x => x.Value === value).Name;

        resolve(name);
      }, error => reject(error));
    });
  }

  getPaymentMethodName(value: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.dataService.get('/api/Bill/GetPaymentMethod').subscribe((data: Enum[]) => {
        const name = data.find(x => x.Value === value).Name;

        resolve(name);
      }, error => reject(error));
    });
  }

  loadPaymentMethod() {
    this.dataService.get('/api/Bill/GetPaymentMethod').subscribe((data: Enum[]) => {
      //this.paymentMethods = data;
    });
  }

  searchDateRange(dateValue: any) {
    this.startDate = dateValue[0];
    this.endDate = dateValue[1];

    this.loadData();
  }

  changeLengthMenu(event: any) {
    this.pageSize = event.target.value;
    this.loadData();
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;
    this.loadData();
  }

  selectAll() {
    for (var i = 0; i < this.bills.length; i++) {
      this.bills[i].Selected = this.selectedAll;
    }

    this.nothingSelected = true;
  }

  checkIfAllSelected() {
    this.selectedAll = this.bills.every((item: Bill) => {
      return item.Selected == true;
    });

    this.nothingSelected = this.bills.every((item: Bill) => {
      return item.Selected == false;
    });

    if (!this.selectedAll && !this.nothingSelected) {
      $('#chkAll').prop('indeterminate', true)
    } else {
      $('#chkAll').prop('indeterminate', false)
    }
  }
}
