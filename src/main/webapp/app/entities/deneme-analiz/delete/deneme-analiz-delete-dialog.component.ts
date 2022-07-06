import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDenemeAnaliz } from '../deneme-analiz.model';
import { DenemeAnalizService } from '../service/deneme-analiz.service';

@Component({
  templateUrl: './deneme-analiz-delete-dialog.component.html',
})
export class DenemeAnalizDeleteDialogComponent {
  denemeAnaliz?: IDenemeAnaliz;

  constructor(protected denemeAnalizService: DenemeAnalizService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.denemeAnalizService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
