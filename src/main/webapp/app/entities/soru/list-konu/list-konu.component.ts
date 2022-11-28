import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SoruService } from '../service/soru.service';
import { ISoru, Soru } from '../soru.model';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SoruDeleteDialogComponent } from '../delete/soru-delete-dialog.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'jhi-list-konu',
  templateUrl: './list-konu.component.html',
  styleUrls: ['./list-konu.component.scss'],
})
export class ListKonuComponent implements OnInit {
  //sorus?: ISoru[]|null;
  sorus?: ISoru[] | null = null;
  isLoading = false;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  konuId:number;
  constructor(private activatedRoute: ActivatedRoute, private soruService: SoruService, protected modalService: NgbModal, private router: Router) {}

  ngOnInit(): void {
    

    this.activatedRoute.params.subscribe(params => {
      if (params['konuId']) {
        console.log('gelen id');
        console.log(params['id']);
        this.handleNavigation(params['konuId'].trim())
        this.konuId = params['konuId'].trim();
      }
    });
  }

  loadAll(id:number): void {
    this.isLoading = true;

    this.soruService.queryBykonu(id,{ page: this.page - 1, size: this.itemsPerPage }).subscribe({
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


  delete(soru: ISoru): void {
    const modalRef = this.modalService.open(SoruDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.soru = soru;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll(this.konuId);
      }
    });
  }

  transition(): void {
    this.router.navigate(['/soru/konu/',this.konuId], {
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

  getSorus(id: number): void {
    this.soruService.getSoruByKonu(id).subscribe(res => {
      this.sorus = res.body;
    });
  }

  private onSuccess(sorular: Soru[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.sorus = sorular;
  }
  
  private handleNavigation(id:number): void {
    this.loadAll(id);

    
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      console.log(data);
      console.log(params);
      console.log("bunlar önemli");
      
      const page = params.get('page');
      this.page = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      
      this.ascending = sort[1] === ASC;
      this.loadAll(id);
    });
  }
}
