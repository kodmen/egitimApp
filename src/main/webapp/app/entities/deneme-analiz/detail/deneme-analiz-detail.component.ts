import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IDenemeAnaliz } from '../deneme-analiz.model';

@Component({
  selector: 'jhi-deneme-analiz-detail',
  templateUrl: './deneme-analiz-detail.component.html',
})
export class DenemeAnalizDetailComponent implements OnInit {
  denemeAnaliz: IDenemeAnaliz | null = null;

  constructor(protected activatedRoute: ActivatedRoute,protected router:Router) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ denemeAnaliz }) => {
      this.denemeAnaliz = denemeAnaliz;
    });
  }

  previousState(): void {
    this.router.navigate(['deneme-analiz']);
  }

  konuAnalizYanlis(analiz:string):string{
    const ayri = analiz.split("--");
    return ayri[0]
  }

  konuAnalizBos(analiz:string):string{
    const ayri = analiz.split("--");
    return ayri[1];
  }
}
