import { Injectable } from '@angular/core';

import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';

import { DialogConfirmComponent } from '../components/dialog-confirm/dialog-confirm.component';

@Injectable()
export class NotificationService {
  constructor(
    private toastr: ToastrService,
    private modal: BsModalService
  ) {

  }

  config: Partial<IndividualConfig> = {
    positionClass: 'toast-bottom-left',
    timeOut: 2000
  };

  printInfoMessage(message: string) {
    this.toastr.info(message, null, this.config);
  }

  printWarningMessage(message: string) {
    this.toastr.warning(message, null, this.config);
  }

  printSuccessMessage(message: string) {
    this.toastr.success(message, null, this.config);
  }

  printErrorMessage(message: string) {
    this.toastr.error(message, null, this.config);
  }

  printConfirmationDialog(message: string, okCallback: () => any) {
    const modal = this.modal.show(DialogConfirmComponent);
    (<DialogConfirmComponent>modal.content).showConfirmationModal('Thông báo', message);

    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        okCallback();
      }
    });
  }
}
