import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISoru } from '../soru.model';
import { SoruService } from '../service/soru.service';

@Component({
  templateUrl: './soru-delete-dialog.component.html',
})
export class SoruDeleteDialogComponent {
  soru?: ISoru;

  constructor(protected soruService: SoruService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.soruService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
