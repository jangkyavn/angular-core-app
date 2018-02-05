import { Component, ViewChild, OnInit } from '@angular/core';

import { DataService, NotificationService } from '../../../services';
import { MessageConstants } from '../../../common';
import { PagedResult } from '../../../models/paged-result.model';
import { RoleModalAddEditComponent } from './role-modal-add-edit/role-modal-add-edit.component';

@Component({
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('roleModalAddEdit') roleModalAddEdit: RoleModalAddEditComponent;

  roles: any[];
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
      const data: PagedResult = response;

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

  delete(id: string) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.dataService.delete(`/api/Role/${id}`).subscribe(() => {
        this.loadData();
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      })
    })
  }

  search(value: string) {
    this.keyword = value;
    this.loadData();
  }

  changeLengthMenu(value: number) {
    this.pageSize = value;
    this.loadData();
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;
    this.loadData();
  }
}
