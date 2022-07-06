import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKonu } from '../konu.model';

@Component({
  selector: 'jhi-konu-detail',
  templateUrl: './konu-detail.component.html',
})
export class KonuDetailComponent implements OnInit {
  konu: IKonu | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ konu }) => {
      this.konu = konu;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
