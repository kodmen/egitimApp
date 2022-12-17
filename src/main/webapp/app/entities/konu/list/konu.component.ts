import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IKonu, Konu } from '../konu.model';
import { KonuService } from '../service/konu.service';
import { KonuDeleteDialogComponent } from '../delete/konu-delete-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ASC, DESC, ITEMS_PER_PAGE,SORT } from 'app/config/pagination.constants';
import { combineLatest } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-konu',
  templateUrl: './konu.component.html',
})
export class KonuComponent implements OnInit {
  konus?: IKonu[] | null = null;

  seacrhKonu?: IKonu | null = null;
  isLoading = false;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  search = this.fb.group({
    text: [],
  });

  constructor(protected fb:FormBuilder ,protected konuService: KonuService, protected modalService: NgbModal,private router:Router, private activatedRoute: ActivatedRoute) {}

  searchText(): void {
    const seacrh = this.search.get(['text'])!.value;
    this.konuService.seacrh(seacrh).subscribe(res => {
      if (res.body) {
        this.seacrhKonu = res.body;
      }
    });
  }

  loadAll(): void {
    this.isLoading = true;

    this.konuService.queryPage({ page: this.page - 1, size: this.itemsPerPage }).subscribe({
      next: (res: HttpResponse<IKonu[]>) => {
        this.isLoading = false;
        this.konus = res.body ?? [];
        this.onSuccess(res.body, res.headers);
      },
      error: () => {
        this.isLoading = false;
      },
    });
    this.seacrhKonu = null;
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

  ngOnInit(): void {
    this.handleNavigation()
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

  sorularagit(id:any):any{
    console.log("gidiyorum");
    
    this.router.navigate([`soru/konu/`,id]);
  }

  private onSuccess(users: Konu[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.konus = users;
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
}
