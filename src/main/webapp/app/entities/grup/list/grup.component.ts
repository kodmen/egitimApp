import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrup } from '../grup.model';
import { GrupService } from '../service/grup.service';
import { GrupDeleteDialogComponent } from '../delete/grup-delete-dialog.component';

@Component({
  selector: 'jhi-grup',
  templateUrl: './grup.component.html',
})
export class GrupComponent implements OnInit {
  grups?: IGrup[];
  isLoading = false;

  constructor(protected grupService: GrupService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.grupService.query().subscribe({
      next: (res: HttpResponse<IGrup[]>) => {
        this.isLoading = false;
        this.grups = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IGrup): number {
    return item.id!;
  }

  delete(grup: IGrup): void {
    const modalRef = this.modalService.open(GrupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grup = grup;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
