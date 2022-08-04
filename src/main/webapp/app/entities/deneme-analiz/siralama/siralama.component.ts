import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DenemeAnalizService } from '../service/deneme-analiz.service';
import { DenemeAnalizSiralamaDto, IDenemeAnalizSiralamaDto } from './DenemeAnalizSiralamaDto.model';
import { combineLatest } from 'rxjs';

import { ASC, DESC, ITEMS_PER_PAGE,SORT } from 'app/config/pagination.constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-siralama',
  templateUrl: './siralama.component.html',
  styleUrls: ['./siralama.component.scss'],
})
export class SiralamaComponent implements OnInit {
  denemeAnalizs?: IDenemeAnalizSiralamaDto[];

  analiz3?: IDenemeAnalizSiralamaDto[];
  analiz3Haric?: IDenemeAnalizSiralamaDto[];

  isLoading = false;


  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;



  constructor(private denemeAnalizService: DenemeAnalizService,private activatedRoute:ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.handleNavigation()
  }

  ayir(): void {
    const eleman = this.denemeAnalizs?.length;
    this.analiz3 = this.denemeAnalizs?.slice(0, 3);

    this.analiz3Haric = this.denemeAnalizs?.slice(3, eleman);
  }

  loadAll(): void {
    this.isLoading = true;

    this.denemeAnalizService.getTop10Analiz({ page: this.page - 1, size: this.itemsPerPage }).subscribe({
      next: (res: HttpResponse<IDenemeAnalizSiralamaDto[]>) => {
        this.isLoading = false;
        this.denemeAnalizs = res.body ?? [];
        this.onSuccess(res.body, res.headers);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }


  sureHesapla(millis: number): string {
    const seconds = Math.floor((millis / 100) % 60);
    const minutes = Math.floor((millis / 100 / 60) % 60);
    const kusurat = millis - ((minutes * 60 + seconds) * 100)
    
    if(minutes === 0){
      return `  ${seconds} sn : ${kusurat} ms` ;
    }
    return `  ${minutes} dk : ${seconds} sn : ${kusurat} ms` ;
  }



  transition(): void {
    this.router.navigate(['./siralama'], {
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

  private onSuccess(users: DenemeAnalizSiralamaDto[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.denemeAnalizs = users!;
  }
}
