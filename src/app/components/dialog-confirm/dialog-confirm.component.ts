import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {
  public active: boolean = false;
  public body: string;
  public title: string;
  public onClose: Subject<boolean>;

  constructor(
    private _bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  public showConfirmationModal(title: string, body: string): void {
    this.title = title;
    this.body = body;
    this.active = true;
  }

  public onConfirm(): void {
    this.active = false;
    this.onClose.next(true);
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    this.active = false;
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  public hideConfirmationModal(): void {
    this.active = false;
    this.onClose.next(null);
    this._bsModalRef.hide();
  }
}
