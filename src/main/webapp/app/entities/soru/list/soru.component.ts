import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISoru } from '../soru.model';
import { SoruService } from '../service/soru.service';
import { SoruDeleteDialogComponent } from '../delete/soru-delete-dialog.component';

@Component({
  selector: 'jhi-soru',
  templateUrl: './soru.component.html',
})
export class SoruComponent implements OnInit {
  sorus?: ISoru[];
  isLoading = false;

  constructor(protected soruService: SoruService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.soruService.query().subscribe({
      next: (res: HttpResponse<ISoru[]>) => {
        this.isLoading = false;
        this.sorus = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISoru): number {
    return item.id!;
  }

  delete(soru: ISoru): void {
    const modalRef = this.modalService.open(SoruDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.soru = soru;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
