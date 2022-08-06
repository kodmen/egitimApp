import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DenemeAnaliz, IDenemeAnaliz } from '../deneme-analiz.model';
import { DenemeAnalizService } from '../service/deneme-analiz.service';
import { DenemeAnalizDeleteDialogComponent } from '../delete/deneme-analiz-delete-dialog.component';
import { combineLatest } from 'rxjs';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-deneme-analiz',
  templateUrl: './deneme-analiz.component.html',
})
export class DenemeAnalizComponent implements OnInit {
  denemeAnalizs?: IDenemeAnaliz[];
  isLoading = false;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  constructor(
    protected denemeAnalizService: DenemeAnalizService,
    protected modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.denemeAnalizService.query({ page: this.page - 1, size: this.itemsPerPage }).subscribe({
      next: (res: HttpResponse<IDenemeAnaliz[]>) => {
        this.isLoading = false;
        this.denemeAnalizs = res.body ?? [];
        this.onSuccess(res.body, res.headers);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  konuAnalizYanlis(analiz: string): string {
    const ayri = analiz.split('--');
    return ayri[0];
  }

  konuAnalizBos(analiz: string): string {
    const ayri = analiz.split('--');
    return ayri[1];
  }

  konuAnalizYanlisSayi(analiz:string):number{
    const yanlisSorularStr = analiz.slice(7);
    console.log("slice 7 sonra");
    
    console.log(yanlisSorularStr);
    if(yanlisSorularStr.length > 1 ){
      const yanlisSorular = yanlisSorularStr.split(",");
      return yanlisSorular.length -1;
    }
    return 0
  }

  konuAnalizBosSayi(analiz:string):number{
    const yanlisSorularStr = analiz.slice(5);
    if(yanlisSorularStr.length > 1 ){
      const yanlisSorular = yanlisSorularStr.split(",");
      return yanlisSorular.length -1;
    }
    return 0
  }

  ngOnInit(): void {
    this.handleNavigation();
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

  transition(): void {
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: `${this.predicate},${this.ascending ? ASC : DESC}`,
      },
    });
  }

  private handleNavigation(): void {
    this.loadAll();
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      this.page = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');

      this.ascending = sort[1] === ASC;
      this.loadAll();
    });
  }

  private onSuccess(denemeAnalizs: DenemeAnaliz[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.denemeAnalizs = denemeAnalizs!;
  }
}
