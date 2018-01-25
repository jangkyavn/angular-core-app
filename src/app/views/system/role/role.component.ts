import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../services/data.service';
import { NotificationService } from 'app/services';

import { SystemConstants } from 'app/common/system.constants';
import { MessageConstants } from 'app/common/message.constants';

@Component({
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  modalTitle: string = '';

  roleForm: FormGroup;

  roles$: Observable<any[]>;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;

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
    this.roles$ = this.dataService.get('/api/Role');
  }

  showAddNew() {
    this.modalTitle = 'Thêm mới thông tin quyền';
    this.modalAddEdit.show();

    this.roleForm.reset();
  }

  showEdit(id: string) {
    this.modalTitle = 'Sửa thông tin quyền';
    this.modalAddEdit.show();
    this.roleForm.reset();

    this.dataService.get(`/api/Role/${id}`).subscribe(data => {
      this.roleForm.setValue(data);
    });
  }

  onSubmitForm() {
    const data = this.roleForm.value;

    if (data.Id === null) {
      this.dataService.post('/api/Role', JSON.stringify(data)).subscribe(() => {
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
}
