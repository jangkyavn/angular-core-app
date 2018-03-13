import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService, DataService, NotificationService, UtilityService } from '../../../services';
import { SystemConstants, MessageConstants } from '../../../common';

import { PagedResult } from '../../../models/paged-result.model';
import { User } from '../../../models/user.model';

import { UserModalAddEditComponent } from './user-modal-add-edit/user-modal-add-edit.component';
import { UserModalInfoDetailComponent } from './user-modal-info-detail/user-modal-info-detail.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('userModalAddEdit') userModalAddEdit: UserModalAddEditComponent;
  @ViewChild('userModalInfoDetail') userModalInfoDetail: UserModalInfoDetailComponent;

  baseApi: string = SystemConstants.BASE_API;
  noImage: string = this.baseApi + '/uploaded/images/no_image.png';
  isLoading: boolean;

  users: User[];

  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  firstRow: number;
  lastRow: number;

  filterKeyword: string = '';
  filterGender: any = '';
  selectedAll: boolean;
  nothingSelected: boolean;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    if (this.authService.checkAccess('USER')) {
      this.loadData();
    } else {
      this.utilityService.navigateToLogin();
    }
  }

  loadData() {
    this.isLoading = true;

    const url = `/api/User/GetAllPaging?keyword=${this.filterKeyword}&gender=${this.filterGender}&page=${this.pageIndex}&pageSize=${this.pageSize}`;
    this.dataService.get(url).subscribe((response: any) => {
      this.isLoading = false;

      const data: PagedResult<User> = response;

      this.users = data.Results;
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

  showAddNew() {
    this.userModalAddEdit.showModal('Thêm mới thông tin người dùng');
  }

  showEdit(id: string) {
    this.userModalAddEdit.showModal('Sửa thông tin người dùng', id);
  }

  showView(id: string) {
    this.dataService.get(`/api/User/${id}`).subscribe((data: any) => {
      this.userModalInfoDetail.showModal(data)
    });
  }

  saveChanges(result: boolean) {
    if (result) {
      this.loadData();
      this.userModalAddEdit.hideModal();
    }
  }

  delete(id: number) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.dataService.delete(`/api/User/${id}`).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.loadData();
          this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        }
      })
    })
  }

  public deleteMulti() {
    let checkedItems = this.users.filter(x => x.Selected);
    let checkedIds = [];

    for (let i = 0; i < checkedItems.length; i++) {
      checkedIds.push(checkedItems[i]['Id']);
    }

    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_SELECTED_MSG, () => {
      this.dataService.delete(`/api/User/DeleteMulti?strIds=${JSON.stringify(checkedIds)}`).subscribe((response: any) => {
        if (response !== undefined && response !== null) {
          this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
          this.loadData();
        }
      });
    });
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
    for (var i = 0; i < this.users.length; i++) {
      this.users[i].Selected = this.selectedAll;
    }

    this.nothingSelected = !this.selectedAll;
  }

  checkIfAllSelected() {
    this.selectedAll = this.users.every((item: User) => {
      return item.Selected == true;
    });

    this.nothingSelected = this.users.every((item: User) => {
      return item.Selected == false;
    });

    if (!this.selectedAll && !this.nothingSelected) {
      (document.querySelector('#chkAll') as HTMLInputElement).indeterminate = true;
    } else {
      (document.querySelector('#chkAll') as HTMLInputElement).indeterminate = false;
    }
  }
}