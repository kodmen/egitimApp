import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDonem } from '../donem.model';

@Component({
  selector: 'jhi-donem-detail',
  templateUrl: './donem-detail.component.html',
})
export class DonemDetailComponent implements OnInit {
  donem: IDonem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donem }) => {
      this.donem = donem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
