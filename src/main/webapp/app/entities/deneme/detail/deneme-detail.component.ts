import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDeneme } from '../deneme.model';

@Component({
  selector: 'jhi-deneme-detail',
  templateUrl: './deneme-detail.component.html',
})
export class DenemeDetailComponent implements OnInit {
  deneme: IDeneme | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deneme }) => {
      this.deneme = deneme;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
