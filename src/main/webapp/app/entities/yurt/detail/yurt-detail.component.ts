import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IYurt } from '../yurt.model';

@Component({
  selector: 'jhi-yurt-detail',
  templateUrl: './yurt-detail.component.html',
})
export class YurtDetailComponent implements OnInit {
  yurt: IYurt | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ yurt }) => {
      this.yurt = yurt;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
