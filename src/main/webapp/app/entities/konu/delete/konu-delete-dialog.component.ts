import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKonu } from '../konu.model';
import { KonuService } from '../service/konu.service';

@Component({
  templateUrl: './konu-delete-dialog.component.html',
})
export class KonuDeleteDialogComponent {
  konu?: IKonu;

  constructor(protected konuService: KonuService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.konuService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
