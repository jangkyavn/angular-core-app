import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../../../services';

@Component({
  selector: 'role-modal-add-edit',
  templateUrl: './role-modal-add-edit.component.html',
  styleUrls: ['./role-modal-add-edit.component.scss']
})
export class RoleModalAddEditComponent implements OnInit {
  @Output() saveChangesResult = new EventEmitter<boolean>(false);
  @ViewChild('roleModalAddEdit') public roleModalAddEdit: ModalDirective;

  modalTitle: string;
  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
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

  saveChanges() {
    const data = this.roleForm.value;

    if (data.Id === null) {
      this.dataService.post('/api/Role', data).subscribe(() => {
        this.saveChangesResult.emit(true);
      });
    } else {
      this.dataService.put('/api/Role', data).subscribe(() => {
        this.saveChangesResult.emit(true);
      });
    }
  }

  showModal(title: string, id?: string) {
    this.modalTitle = title;
    this.roleForm.reset();

    if (id !== undefined) {
      this.dataService.get(`/api/Role/${id}`).subscribe(data => {
        this.roleForm.patchValue(data);
      });
    }

    this.roleModalAddEdit.show();
  }

  hideModal() {
    this.roleModalAddEdit.hide();
  }
}
