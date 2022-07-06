import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDenemeAnaliz } from '../deneme-analiz.model';
import { DenemeAnalizService } from '../service/deneme-analiz.service';
import { DenemeAnalizDeleteDialogComponent } from '../delete/deneme-analiz-delete-dialog.component';

@Component({
  selector: 'jhi-deneme-analiz',
  templateUrl: './deneme-analiz.component.html',
})
export class DenemeAnalizComponent implements OnInit {
  denemeAnalizs?: IDenemeAnaliz[];
  isLoading = false;

  constructor(protected denemeAnalizService: DenemeAnalizService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.denemeAnalizService.query().subscribe({
      next: (res: HttpResponse<IDenemeAnaliz[]>) => {
        this.isLoading = false;
        this.denemeAnalizs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDenemeAnaliz): number {
    return item.id!;
  }

  delete(denemeAnaliz: IDenemeAnaliz): void {
    const modalRef = this.modalService.open(DenemeAnalizDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.denemeAnaliz = denemeAnaliz;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
