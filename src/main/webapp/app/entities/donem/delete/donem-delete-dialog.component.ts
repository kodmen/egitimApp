import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonem } from '../donem.model';
import { DonemService } from '../service/donem.service';

@Component({
  templateUrl: './donem-delete-dialog.component.html',
})
export class DonemDeleteDialogComponent {
  donem?: IDonem;

  constructor(protected donemService: DonemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.donemService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
