import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService } from '../../../services';
import { SystemConstants, MessageConstants } from '../../../common';
import { PagedResult } from 'app/models/paged-result.model';

@Component({
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  modalTitle: string = '';

  roleForm: FormGroup;

  roles: any[];
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  keyword: string = '';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadData();
    this.createForm();
  }

  createForm() {
    this.roleForm = this.fb.group({
      Id: [''],
      Name: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      Description: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]]
    });
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
    });
  }

  showModal(title: string) {
    this.modalTitle = title;
    this.modalAddEdit.show();
    this.roleForm.reset();
  }

  showAddNew() {
    this.showModal('Thêm mới thông tin quyền');
  }

  showEdit(id: string) {
    this.showModal('Sửa thông tin quyền');

    this.dataService.get(`/api/Role/${id}`).subscribe(data => {
      this.roleForm.setValue(data);
    });
  }

  onSubmitForm() {
    const data = this.roleForm.value;

    if (data.Id === null) {
      this.dataService.post('/api/Role', data).subscribe(() => {
        this.loadData();
        this.modalAddEdit.hide();
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      });
    } else {
      this.dataService.put('/api/Role', data).subscribe(() => {
        this.loadData();
        this.modalAddEdit.hide();
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      });
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
  
  onChange(value: number) {
    this.pageSize = value;

    this.loadData();
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;

    this.loadData();
  }
}
