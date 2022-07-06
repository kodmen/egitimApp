import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IYurt } from '../yurt.model';
import { YurtService } from '../service/yurt.service';

@Component({
  templateUrl: './yurt-delete-dialog.component.html',
})
export class YurtDeleteDialogComponent {
  yurt?: IYurt;

  constructor(protected yurtService: YurtService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.yurtService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
