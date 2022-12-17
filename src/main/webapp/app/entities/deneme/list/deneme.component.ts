import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Deneme, IDeneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';
import { DenemeDeleteDialogComponent } from '../delete/deneme-delete-dialog.component';
import { ASC, DESC, ITEMS_PER_PAGE,SORT } from 'app/config/pagination.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'jhi-deneme',
  templateUrl: './deneme.component.html',
})
export class DenemeComponent implements OnInit {
  denemes?: IDeneme[]| null = null;
  isLoading = false;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  constructor(protected denemeService: DenemeService, protected modalService: NgbModal,private activatedRoute: ActivatedRoute,private router: Router) {}

  loadAll(): void {
    this.isLoading = true;

    this.denemeService.queryPage({ page: this.page - 1, size: this.itemsPerPage }).subscribe({
      next: (res: HttpResponse<IDeneme[]>) => {
        this.isLoading = false;
        this.denemes = res.body ?? [];
        this.onSuccess(res.body, res.headers);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.handleNavigation();
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

  private onSuccess(users: Deneme[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.denemes = users;
  }
}
