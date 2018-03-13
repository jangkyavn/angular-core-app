import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { User } from '../../../../models/user.model';
import { SystemConstants } from '../../../../common';

@Component({
  selector: 'user-modal-info-detail',
  templateUrl: './user-modal-info-detail.component.html',
  styleUrls: ['./user-modal-info-detail.component.scss']
})
export class UserModalInfoDetailComponent implements OnInit {
  @ViewChild('userModalInfoDetail') userModalInfoDetail: ModalDirective;
  baseApi: string;
  user: User;

  constructor() { }

  ngOnInit() {
    this.baseApi = SystemConstants.BASE_API;
  }

  showModal(data: User) {
    this.user = data;

    this.userModalInfoDetail.show();
  }

  hideModal() {
    this.userModalInfoDetail.hide();
  }
}
