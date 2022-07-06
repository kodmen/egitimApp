import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISoru } from '../soru.model';

@Component({
  selector: 'jhi-soru-detail',
  templateUrl: './soru-detail.component.html',
})
export class SoruDetailComponent implements OnInit {
  soru: ISoru | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ soru }) => {
      this.soru = soru;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
