import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IYurt } from '../yurt.model';
import { YurtService } from '../service/yurt.service';
import { YurtDeleteDialogComponent } from '../delete/yurt-delete-dialog.component';

@Component({
  selector: 'jhi-yurt',
  templateUrl: './yurt.component.html',
})
export class YurtComponent implements OnInit {
  yurts?: IYurt[];
  isLoading = false;

  constructor(protected yurtService: YurtService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.yurtService.query().subscribe({
      next: (res: HttpResponse<IYurt[]>) => {
        this.isLoading = false;
        this.yurts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IYurt): number {
    return item.id!;
  }

  delete(yurt: IYurt): void {
    const modalRef = this.modalService.open(YurtDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.yurt = yurt;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
