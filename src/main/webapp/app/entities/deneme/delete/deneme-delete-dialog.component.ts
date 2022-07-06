import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDeneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';

@Component({
  templateUrl: './deneme-delete-dialog.component.html',
})
export class DenemeDeleteDialogComponent {
  deneme?: IDeneme;

  constructor(protected denemeService: DenemeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.denemeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
