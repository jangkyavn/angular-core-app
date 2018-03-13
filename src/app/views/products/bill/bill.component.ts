import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

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

  billStatusValue: any = '';
  paymentMethodValue: any = '';
  filterKeyword: string = '';
  startDate: Date;
  endDate: Date;
  maxDate = this.endDate;
  bsRangeValue: '';
  bsConfig: Partial<BsDaterangepickerConfig> = {
    containerClass: 'theme-dark-blue',
    rangeInputFormat: 'DD/MM/YYYY'
  };
  isLoading: boolean = false;

  bills: Bill[] = [];
  paymentMethods$: Observable<Enum[]>;
  billStatuses$: Observable<Enum[]>;

  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  firstRow: number;
  lastRow: number;

  selectedAll: boolean;
  nothingSelected: boolean;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.paymentMethods$ = this.dataService.get('/api/Bill/GetPaymentMethod');
    this.billStatuses$ = this.dataService.get('/api/Bill/GetBillStatus');

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const startDate = this.utilityService.dateFormatJson2(this.startDate);
    const endDate = this.utilityService.dateFormatJson2(this.endDate);
    const url = `/api/Bill/GetAllPaging?keyword=${this.filterKeyword}&startDate=${startDate}&endDate=${endDate}&paymentMethod=${this.paymentMethodValue}&billStatus=${this.billStatusValue}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

    this.dataService.get(url).subscribe((response: any) => {
      this.isLoading = false;

      const data: PagedResult<Bill> = response;
      this.bills = [];

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
    setTimeout(() => (document.querySelector('#chkAll') as HTMLInputElement).indeterminate = false, 0);
  }

  saveChanges(result: boolean) {
    if (result) {
      this.loadData();
      this.billModalAddEdit.hideModal();
    }
  }

  showAddNew() {
    this.billModalAddEdit.showModal('Thêm mới thông tin hóa đơn');
  }

  showEdit(id: number) {
    this.billModalAddEdit.showModal('Sửa thông tin hóa đơn', id);
  }

  delete(id: number) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.dataService.delete(`/api/Bill/${id}`).subscribe((response: any) => {
        if (response !== undefined && response !== null) {
          this.loadData();
          this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        }
      })
    })
  }

  getBillStatusName(value: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.billStatuses$.subscribe((data: Enum[]) => {
        const name = data.find(x => x.Value === value).Name;

        resolve(name);
      }, error => reject(error));
    });
  }

  getPaymentMethodName(value: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.paymentMethods$.subscribe((data: Enum[]) => {
        const name = data.find(x => x.Value === value).Name;

        resolve(name);
      }, error => reject(error));
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
      (document.querySelector('#chkAll') as HTMLInputElement).indeterminate = true;
    } else {
      (document.querySelector('#chkAll') as HTMLInputElement).indeterminate = false;
    }
  }

  resetFormSearch() {
    this.filterKeyword = '';
    this.startDate = null;
    this.endDate = null;
    this.bsRangeValue = '';

    this.loadData();
  }
}
