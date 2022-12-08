import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMesaj } from '../mesaj.model';
import { MesajService } from '../service/mesaj.service';

@Component({
  templateUrl: './mesaj-delete-dialog.component.html',
})
export class MesajDeleteDialogComponent {
  mesaj?: IMesaj;

  constructor(protected mesajService: MesajService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mesajService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
