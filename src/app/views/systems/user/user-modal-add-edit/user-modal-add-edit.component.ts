import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { DataService, NotificationService, UtilityService, UploadService } from '../../../../services';
import { SystemConstants } from '../../../../common/system.constants';
import { MessageConstants } from '../../../../common';

import { User } from '../../../../models/user.model';
import { Role } from '../../../../models/role.model';

function passwordConfirming(c: AbstractControl): any {
  if (!c.parent || !c) return;
  const pwd = c.parent.get('Password');
  const cpwd = c.parent.get('ConfirmPassword')

  if (!pwd || !cpwd) return;
  if (pwd.value !== cpwd.value) {
    return { notsame: true };
  }
}

@Component({
  selector: 'user-modal-add-edit',
  templateUrl: './user-modal-add-edit.component.html',
  styleUrls: ['./user-modal-add-edit.component.scss']
})
export class UserModalAddEditComponent implements OnInit {
  @Output() saveChangesResult = new EventEmitter<boolean>(false);
  @ViewChild('userModalAddEdit') public userModalAddEdit: ModalDirective;

  userForm: FormGroup;
  roles: Role[];

  maskPhone = ['+', '8', '4', ' ', /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  baseApi: string = SystemConstants.BASE_API;
  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };

  modalTitle: string;
  imageUrl: string;
  isAddNew: boolean;
  buttonName: string;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.createForm();
    this.loadRoles();
  }

  loadRoles() {
    this.dataService.get('/api/Role').subscribe((response: Role[]) => {
      let data = [];

      for (let item of response) {
        data.push({
          Id: item.Id,
          Name: item.Name,
          Selected: false
        });
      }

      this.roles = data;
    })
  }

  createForm() {
    this.userForm = this.fb.group({
      Id: [''],
      Email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]],
      Password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      ConfirmPassword: ['', [
        Validators.required,
        passwordConfirming
      ]],
      FullName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      Gender: ['true', Validators.required],
      BirthDay: [new Date(), [
        Validators.required
      ]],
      PhoneNumber: ['', Validators.required],
      DateCreated: [''],
      Avatar: ['', Validators.maxLength(200)],
      Address: ['', Validators.maxLength(200)],
      Roles: [[], Validators.required],
      Status: [false, Validators.required]
    });
  }

  saveChanges() {
    const data = this.userForm.value;
    data.Gender = !!(data.Gender === 'true');
    data.PhoneNumber = this.utilityService.formatPhoneNumber(data.PhoneNumber);

    if (data.Id === null) {
      this.dataService.post('/api/User', data).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          if (typeof response === 'boolean' && response === false) {
            (document.querySelector('#txtEmail') as HTMLInputElement).focus();
            this.saveChangesResult.emit(false);
            this.notificationService.printWarningMessage(MessageConstants.EXISTED_EMAIL);
          } else {
            this.saveChangesResult.emit(true);
            this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          }
        }
        else {
          this.saveChangesResult.emit(false);
        }
      });
    } else {
      this.dataService.put('/api/User', data).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.saveChangesResult.emit(true);
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        }
        else {
          this.saveChangesResult.emit(false);
        }
      });
    }
  }

  showModal(title: string, id?: string) {
    this.userForm.reset();
    this.modalTitle = title;
    this.imageUrl = '';

    if (id !== undefined) {
      this.isAddNew = false;

      this.dataService.get(`/api/User/${id}`).subscribe((response: any) => {
        let data: User = response;

        let lengthRoles = this.roles.length;
        let lengthRoleDetails = data.Roles.length;
        for (let i = 0; i < lengthRoles; i++) {
          for (let j = 0; j < lengthRoleDetails; j++) {
            if (this.roles[i].Name === data.Roles[j]) {
              this.roles[i].Selected = true;
              break;
            }
          }
        }

        this.userForm.patchValue({
          ...data,
          Password: '******',
          ConfirmPassword: '******',
          Gender: data.Gender ? 'true' : 'false',
          BirthDay: new Date(data.BirthDay)
        });

        this.buttonName = data.Roles.join(', ');
        this.imageUrl = data.Avatar == null ? '' : this.baseApi + data.Avatar;
      });
    } else {
      this.isAddNew = true;
      this.buttonName = 'Chọn quyền';

      this.userForm.patchValue({
        Gender: 'true',
        BirthDay: new Date(),
        Status: false
      });
    }

    this.userModalAddEdit.show();
  }

  hideModal() {
    this.userModalAddEdit.hide();
    this.loadRoles();
  }

  changeFileImage(files: any) {
    this.uploadService.postWithFile('/api/Upload/UploadImage?type=users', null, files).then((imageUrl: string) => {
      this.userForm.patchValue({
        Avatar: imageUrl
      })

      this.imageUrl = imageUrl == '' ? '' : this.baseApi + imageUrl;
    })
  }

  getSelectedItem(event: string[]) {
    this.userForm.patchValue({
      Roles: event
    });
  }
}