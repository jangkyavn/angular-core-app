import { Component, ViewChild, OnInit } from '@angular/core';

import { AuthService, DataService, NotificationService, UtilityService } from '../../../services';
import { MessageConstants } from '../../../common';
import { PagedResult } from '../../../models/paged-result.model';
import { Role } from '../../../models/role.model';

import { RoleModalAddEditComponent } from './role-modal-add-edit/role-modal-add-edit.component';
import { RoleModalPermissionComponent } from './role-modal-permission/role-modal-permission.component';

@Component({
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('roleModalAddEdit') roleModalAddEdit: RoleModalAddEditComponent;
  @ViewChild('roleModalPermission') roleModalPermission: RoleModalPermissionComponent;

  roles: Role[];
  isLoading: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  firstRow: number;
  lastRow: number;
  keyword: string = '';

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    if (!this.authService.checkAccess('ROLE')) {
      this.utilityService.navigateToLogin();
    } else {
      this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;

    const url = `/api/Role/GetAllPaging?keyword=${this.keyword}&page=${this.pageIndex}&pageSize=${this.pageSize}`;
    this.dataService.get(url).subscribe((response: any) => {
      this.isLoading = false;

      const data: PagedResult<Role> = response;

      this.roles = data.Results;
      this.pageIndex = data.CurrentPage;
      this.pageSize = data.PageSize;
      this.totalRow = data.RowCount;
      this.pageCount = data.PageCount;
      this.firstRow = data.FirstRowOnPage;
      this.lastRow = data.LastRowOnPage;
    });
  }

  showAddNew() {
    this.roleModalAddEdit.showModal('Thêm mới thông tin quyền');
  }

  showPermission(id: string) {
    this.roleModalPermission.showModal(id);
  }

  showEdit(id: string) {
    this.roleModalAddEdit.showModal('Sửa thông tin quyền', id);
  }

  saveChanges(result: boolean) {
    if (result) {
      this.loadData();
      this.roleModalAddEdit.hideModal();
    }
  }

  saveChangesPermission(result: boolean) {
    if (result) {
      this.roleModalPermission.hideModal();
      this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
    }
  }

  delete(id: string) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.dataService.delete(`/api/Role/${id}`).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.loadData();
          this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        }
      })
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
}
