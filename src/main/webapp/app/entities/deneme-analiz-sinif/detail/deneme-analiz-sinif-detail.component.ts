import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDenemeAnalizSinif } from '../deneme-analiz-sinif.model';

@Component({
  selector: 'jhi-deneme-analiz-sinif-detail',
  templateUrl: './deneme-analiz-sinif-detail.component.html',
})
export class DenemeAnalizSinifDetailComponent implements OnInit {
  denemeAnalizSinif: IDenemeAnalizSinif | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ denemeAnalizSinif }) => {
      this.denemeAnalizSinif = denemeAnalizSinif;
    });
  }

  previousState(): void {
    window.history.back();
  }
}