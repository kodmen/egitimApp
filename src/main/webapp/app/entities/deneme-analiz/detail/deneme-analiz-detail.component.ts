import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDenemeAnaliz } from '../deneme-analiz.model';

@Component({
  selector: 'jhi-deneme-analiz-detail',
  templateUrl: './deneme-analiz-detail.component.html',
})
export class DenemeAnalizDetailComponent implements OnInit {
  denemeAnaliz: IDenemeAnaliz | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ denemeAnaliz }) => {
      this.denemeAnaliz = denemeAnaliz;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
