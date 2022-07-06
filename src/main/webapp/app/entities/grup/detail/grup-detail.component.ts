import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrup } from '../grup.model';

@Component({
  selector: 'jhi-grup-detail',
  templateUrl: './grup-detail.component.html',
})
export class GrupDetailComponent implements OnInit {
  grup: IGrup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grup }) => {
      this.grup = grup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
