import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISinif } from '../sinif.model';

@Component({
  selector: 'jhi-sinif-detail',
  templateUrl: './sinif-detail.component.html',
})
export class SinifDetailComponent implements OnInit {
  sinif: ISinif | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sinif }) => {
      this.sinif = sinif;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
