import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDenemeAnalizSinif } from '../deneme-analiz-sinif.model';
import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';
import { DenemeAnalizSinifDeleteDialogComponent } from '../delete/deneme-analiz-sinif-delete-dialog.component';

@Component({
  selector: 'jhi-deneme-analiz-sinif-detail',
  templateUrl: './deneme-analiz-sinif-detail.component.html',
})
export class DenemeAnalizSinifDetailComponent implements OnInit {
  denemeAnalizSinifs?: IDenemeAnalizSinif[];
  isLoading = false;

  constructor(protected denemeAnalizSinifService: DenemeAnalizSinifService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.denemeAnalizSinifService.query().subscribe({
      next: (res: HttpResponse<IDenemeAnalizSinif[]>) => {
        this.isLoading = false;
        this.denemeAnalizSinifs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDenemeAnalizSinif): number {
    return item.id!;
  }

  delete(denemeAnalizSinif: IDenemeAnalizSinif): void {
    const modalRef = this.modalService.open(DenemeAnalizSinifDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.denemeAnalizSinif = denemeAnalizSinif;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
