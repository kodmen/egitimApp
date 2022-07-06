import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IKonu } from '../konu.model';
import { KonuService } from '../service/konu.service';
import { KonuDeleteDialogComponent } from '../delete/konu-delete-dialog.component';

@Component({
  selector: 'jhi-konu',
  templateUrl: './konu.component.html',
})
export class KonuComponent implements OnInit {
  konus?: IKonu[];
  isLoading = false;

  constructor(protected konuService: KonuService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.konuService.query().subscribe({
      next: (res: HttpResponse<IKonu[]>) => {
        this.isLoading = false;
        this.konus = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IKonu): number {
    return item.id!;
  }

  delete(konu: IKonu): void {
    const modalRef = this.modalService.open(KonuDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.konu = konu;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
