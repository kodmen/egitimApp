import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IDeneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';

@Component({
  selector: 'jhi-ogr-deneme-list',
  templateUrl: './ogr-deneme-list.component.html',
  styleUrls: ['./ogr-deneme-list.component.scss']
})
export class OgrDenemeListComponent implements OnInit {

  denemes?: IDeneme[];
  isLoading = false;

  constructor(private denemeService: DenemeService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.denemeService.query().subscribe({
      next: (res: HttpResponse<IDeneme[]>) => {
        this.isLoading = false;
        this.denemes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

}
