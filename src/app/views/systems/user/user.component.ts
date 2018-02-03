import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService, UtilityService, UploadService } from '../../../services';
import { SystemConstants, MessageConstants } from '../../../common';

import { PagedResult } from '../../../models/paged-result.model';
import { User } from '../../../models/user.model';
import { Role } from '../../../models/role.model';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  public mask = ['+', '8', '4', ' ', /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  modalTitle: string = '';
  baseApi: string = SystemConstants.BASE_API;
  imageUrl: string;
  noImage: string = this.baseApi + '/uploaded/images/no_image.png';
  bsValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };
  isAddNew: boolean;
  buttonName: string;

  userForm: FormGroup;
  users: any[];
  roles: Role[];

  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  firstRow: number;
  lastRow: number;

  filterKeyword: string = '';
  filterGender: any;
  selectedAll: boolean;
  nothingSelected: boolean;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private uploadService: UploadService) { }

  ngOnInit() {
    this.loadRoles();
    this.loadData();
    this.createForm();
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
      BirthDay: [new Date(), Validators.required],
      PhoneNumber: ['', Validators.required],
      DateCreated: [''],
      Avatar: [''],
      Address: ['', Validators.maxLength(200)],
      Roles: [[], Validators.required],
      Status: [false, Validators.required]
    });
  }

  loadData() {
    const url = `/api/User/GetAllPaging?keyword=${this.filterKeyword}&gender=${this.filterGender}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

    this.dataService.get(url).subscribe((response: any) => {
      const data: PagedResult = response;

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
    $('#customCheckAll').prop('indeterminate', false);
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

  showModal(title: string, id?: number) {
    this.imageUrl = '';
    this.userForm.reset();

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

        this.buttonName = data.Roles.join(', ');

        this.userForm.patchValue({
          ...data,
          Password: '******',
          ConfirmPassword: '******',
          Gender: data.Gender ? 'true' : 'false',
          BirthDay: new Date(data.BirthDay)
        });

        this.imageUrl = data.Avatar == null ? '' : this.baseApi + data.Avatar;
      });
    } else {
      this.isAddNew = true;

      this.userForm.patchValue({
        Gender: 'true',
        BirthDay: new Date(),
        Status: false
      });

      this.buttonName = 'Chọn quyền';
    }

    this.modalTitle = title;
    this.modalAddEdit.show();
  }

  hideModal() {
    this.loadData();
    this.modalAddEdit.hide();
    $('#fileInputAvatar').val(null);
    this.loadRoles();
  }

  showAddNew() {
    this.showModal('Thêm mới thông tin người dùng');
  }

  showEdit(id: number) {
    this.showModal('Sửa thông tin người dùng', id);
  }

  saveChanges() {
    let data: User = this.userForm.value;
    data.Gender = !!(data.Gender === 'true');
    data.PhoneNumber = this.utilityService.formatPhoneNumber(data.PhoneNumber);

    console.log(data);

    if (data.Id === null) {
      this.dataService.post('/api/User', data).subscribe(() => {
        this.hideModal();
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      });
    } else {
      this.dataService.put('/api/User', data).subscribe(() => {
        this.hideModal();
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      });
    }
  }

  delete(id: number) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this.dataService.delete(`/api/User/${id}`).subscribe(() => {
        this.loadData();
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
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
      this.dataService.delete(`/api/User/DeleteMulti?strIds=${JSON.stringify(checkedIds)}`).subscribe(() => {
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.loadData();
      });
    });
  }

  search(value: string) {
    this.filterKeyword = value;
    this.loadData();
  }

  searchDropDown(event: any) {
    this.filterGender = event.target.value;
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

  selectAll() {
    for (var i = 0; i < this.users.length; i++) {
      this.users[i].Selected = this.selectedAll;
    }

    this.nothingSelected = true;
  }

  checkIfAllSelected() {
    this.selectedAll = this.users.every((item: any) => {
      return item.Selected == true;
    });

    this.nothingSelected = this.users.every((item: any) => {
      return item.Selected == false;
    });

    if (!this.selectedAll && !this.nothingSelected) {
      $('#customCheckAll').prop('indeterminate', true);
    } else {
      $('#customCheckAll').prop('indeterminate', false);
    }
  }

  btnSelectAvatar() {
    $('#fileInputAvatar').click();
  }

  changeFileInputAvatar(files: any) {
    this.uploadService.postWithFile('/api/Upload/UploadImage?type=users', null, files).then((imageUrl: string) => {
      this.userForm.patchValue({
        Avatar: imageUrl
      })

      this.imageUrl = imageUrl == '' ? '' : this.baseApi + imageUrl;
    })
  }

  closeModal() {
    this.modalAddEdit.hide();
    $('#fileInputAvatar').val(null);
    this.loadRoles();
  }

  getSelectedItem(event: string[]) {
    this.userForm.patchValue({
      Roles: event
    });
  }
}