import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMesaj } from '../mesaj.model';

@Component({
  selector: 'jhi-mesaj-detail',
  templateUrl: './mesaj-detail.component.html',
})
export class MesajDetailComponent implements OnInit {
  mesaj: IMesaj | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesaj }) => {
      this.mesaj = mesaj;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
