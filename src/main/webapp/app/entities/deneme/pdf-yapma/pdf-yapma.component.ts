import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';
import { DenemeSinavDto, DenemeSoruDto } from '../deneme-giris/denemeSinav.model';
import { DenemeKaristirService } from '../service/deneme-karistir.service';
import { DenemeService } from '../service/deneme.service';

@Component({
  selector: 'jhi-pdf-yapma',
  templateUrl: './pdf-yapma.component.html',
  styleUrls: ['./pdf-yapma.component.scss'],
})
export class PdfYapmaComponent implements OnInit {
  foto: string;
  denemeId: number;
  sinav: DenemeSinavDto;
  olusturan: string;
  // p: number;

  duzen: DenemeSoruDto[][];

  // soruları 4 e bölmeliyim önce
  // bu dördünü bir diziye atayım
  // daha sonra bu dörütlü dizileri ikiye böleyim ilk ikisi son ikisi diye

  constructor(
    private fb: FormBuilder,
    private denemeService: DenemeService,
    private route: ActivatedRoute,
    protected router: Router,
    private alertService: AlertService,
    private modalService: NgbModal,
    private karistirService: DenemeKaristirService
  ) {
    // this.p = 0;
    this.foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.getSorular(params['id']);
        this.denemeId = params['id'];

        // this.denemeService.denemeyiGirmismi(this.denemeId).subscribe(res => {
        //   if (res) {
        //     this.alertService.addAlert({ type: 'danger', message: 'denemeye daha önce giriş yapmışsınız' });
        //     this.router.navigate(['/deneme/ogr'], { queryParams: { dahaOnceGirmis: true } });
        //     this.alertService.addAlert({ type: 'danger', message: 'denemeye daha önce giriş yapmışsınız' });
        //   }
        // });
      } else {
        console.log('geldim hata');
      }
    });
  }

  // eğer soru gelmezse hata gösteriyor yani denemenin hiç sorusu yoksa
  getSorular(id: number): void {
    this.denemeService.getDenemeSinav(id).subscribe(res => {
      console.log(res);

      this.sinav = res;
      this.olusturan = res.olusturan!;
      this.sinav.sorular = this.karistirService.shuffleArray(this.sinav.sorular);

      this.duzen = this.batchReduce(this.sinav.sorular, 4);
     
    });
  }

  // diziyi bölme işlemi
  batchReduce<T>(arr: T[], batchSize: number): T[][] {
    return arr.reduce((batches, curr, i) => {
      if (i % batchSize === 0) {
        batches.push([]);
      }
      batches[batches.length - 1].push(arr[i]);
      return batches;
    }, [] as T[][]);
  }
}
