import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonem } from '../donem.model';
import { DonemService } from '../service/donem.service';
import { DonemDeleteDialogComponent } from '../delete/donem-delete-dialog.component';

@Component({
  selector: 'jhi-donem',
  templateUrl: './donem.component.html',
})
export class DonemComponent implements OnInit {
  donems?: IDonem[];
  isLoading = false;

  constructor(protected donemService: DonemService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.donemService.query().subscribe({
      next: (res: HttpResponse<IDonem[]>) => {
        this.isLoading = false;
        this.donems = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDonem): number {
    return item.id!;
  }

  delete(donem: IDonem): void {
    const modalRef = this.modalService.open(DonemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.donem = donem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
