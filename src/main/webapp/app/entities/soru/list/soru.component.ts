import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISoru, Soru } from '../soru.model';
import { SoruService } from '../service/soru.service';
import { SoruDeleteDialogComponent } from '../delete/soru-delete-dialog.component';
import { combineLatest } from 'rxjs';

import { ASC, DESC, ITEMS_PER_PAGE,SORT } from 'app/config/pagination.constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-soru',
  templateUrl: './soru.component.html',
})
export class SoruComponent implements OnInit {
  sorus?: ISoru[] | null = null;
  isLoading = false;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  constructor(
    protected soruService: SoruService,
    protected modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.handleNavigation()
  }

  loadAll(): void {
    this.isLoading = true;

    this.soruService.query({ page: this.page - 1, size: this.itemsPerPage }).subscribe({
      next: (res: HttpResponse<ISoru[]>) => {
        this.isLoading = false;
        this.sorus = res.body ?? [];
        this.onSuccess(res.body, res.headers);
      },
      error: () => {
        this.isLoading = false;
      },
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



  private onSuccess(users: Soru[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.sorus = users;
  }
}
