import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDeneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';
import { DenemeDeleteDialogComponent } from '../delete/deneme-delete-dialog.component';

@Component({
  selector: 'jhi-deneme',
  templateUrl: './deneme.component.html',
})
export class DenemeComponent implements OnInit {
  denemes?: IDeneme[];
  isLoading = false;

  constructor(protected denemeService: DenemeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.denemeService.query().subscribe({
      next: (res: HttpResponse<IDeneme[]>) => {
        this.isLoading = false;
        this.denemes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDeneme): number {
    return item.id!;
  }

  delete(deneme: IDeneme): void {
    const modalRef = this.modalService.open(DenemeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.deneme = deneme;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
