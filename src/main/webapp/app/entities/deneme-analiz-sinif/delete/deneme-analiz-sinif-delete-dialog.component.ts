import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDenemeAnalizSinif } from '../deneme-analiz-sinif.model';
import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';

@Component({
  templateUrl: './deneme-analiz-sinif-delete-dialog.component.html',
})
export class DenemeAnalizSinifDeleteDialogComponent {
  denemeAnalizSinif?: IDenemeAnalizSinif;

  constructor(protected denemeAnalizSinifService: DenemeAnalizSinifService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.denemeAnalizSinifService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
