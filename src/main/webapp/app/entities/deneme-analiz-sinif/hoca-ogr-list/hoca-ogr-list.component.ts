import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDenemeAnaliz } from 'app/entities/deneme-analiz/deneme-analiz.model';
import { IDeneme } from 'app/entities/deneme/deneme.model';
import { DenemeAnalizService } from '../../deneme-analiz/service/deneme-analiz.service';
import { IDenemeAnalizSinif } from '../deneme-analiz-sinif.model';

@Component({
  selector: 'jhi-hoca-ogr-list',
  templateUrl: './hoca-ogr-list.component.html',
  styleUrls: ['./hoca-ogr-list.component.scss']
})
export class HocaOgrListComponent implements OnInit {

  denemeAnalizs?: IDenemeAnaliz[];
  isLoading = false;
  denemeAnalizSinif: IDenemeAnalizSinif | null = null;


  // burda sınıfı idsine göre sınıf analizini getirmek lazım
  // burda deneme analizerini getirmek lazım

  constructor(protected denemeAnalizService: DenemeAnalizService,protected activatedRoute: ActivatedRoute){

  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ denemeAnalizSinif }) => {
      this.denemeAnalizSinif = denemeAnalizSinif;
      this.loadAll();
    });
  }

  loadAll(): void {
    this.isLoading = true;
    const id = this.denemeAnalizSinif?.deneme?.id ;

    this.denemeAnalizService.findDenemeyeGoreAnalizler(id).subscribe({
      next: (res: HttpResponse<IDenemeAnaliz[]>) => {
        this.isLoading = false;
        this.denemeAnalizs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(_index: number, item: IDenemeAnaliz): number {
    return item.id!;
  }

  getDeneme(denemeAnaliz:IDenemeAnalizSinif): IDeneme | undefined{
    return denemeAnaliz.deneme!;
  }
}
