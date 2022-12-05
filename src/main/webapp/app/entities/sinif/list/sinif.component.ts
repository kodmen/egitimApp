import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISinif } from '../sinif.model';
import { SinifService } from '../service/sinif.service';
import { SinifDeleteDialogComponent } from '../delete/sinif-delete-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'jhi-sinif',
  templateUrl: './sinif.component.html',
})
export class SinifComponent implements OnInit {
  sinifs?: ISinif[];
  isLoading = false;

  isSinif = false;

  constructor(protected sinifService: SinifService, protected modalService: NgbModal,private clipboard: Clipboard) {}

  ogrenciSinifVarmi():void{
    this.sinifService.ogrenciSinifVarMi().subscribe(res=>{
      this.isSinif = res;
      console.log("ogrencinin sinifi varmi ",this.isSinif);
      console.log(res);
      
    })
  }

  loadAll(): void {
    this.isLoading = true;

    this.sinifService.query().subscribe({
      next: (res: HttpResponse<ISinif[]>) => {
        this.isLoading = false;
        this.sinifs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  copyText(textToCopy: string):void {
    this.clipboard.copy(textToCopy);
}

  ngOnInit(): void {
    this.loadAll();
    this.ogrenciSinifVarmi();
  }

  trackId(_index: number, item: ISinif): number {
    return item.id!;
  }

  delete(sinif: ISinif): void {
    const modalRef = this.modalService.open(SinifDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sinif = sinif;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
