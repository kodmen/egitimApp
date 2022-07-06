import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISinif } from '../sinif.model';
import { SinifService } from '../service/sinif.service';

@Component({
  templateUrl: './sinif-delete-dialog.component.html',
})
export class SinifDeleteDialogComponent {
  sinif?: ISinif;

  constructor(protected sinifService: SinifService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sinifService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
