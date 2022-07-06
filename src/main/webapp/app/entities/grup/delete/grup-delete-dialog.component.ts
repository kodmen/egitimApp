import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrup } from '../grup.model';
import { GrupService } from '../service/grup.service';

@Component({
  templateUrl: './grup-delete-dialog.component.html',
})
export class GrupDeleteDialogComponent {
  grup?: IGrup;

  constructor(protected grupService: GrupService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grupService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
