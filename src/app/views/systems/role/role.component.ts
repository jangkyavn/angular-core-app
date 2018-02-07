import { Component, ViewChild, OnInit } from '@angular/core';

import { DataService, NotificationService } from '../../../services';
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
    private dataService: DataService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const url = `/api/Role/GetAllPaging?keyword=${this.keyword}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

    this.dataService.get(url).subscribe((response: any) => {
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
      this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
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
      this.dataService.delete(`/api/Role/${id}`).subscribe(() => {
        this.loadData();
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      })
    })
  }

  search(event: any) {
    this.keyword = event.target.value;
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
}
