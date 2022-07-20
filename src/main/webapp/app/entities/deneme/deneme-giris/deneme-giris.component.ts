import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';
import { IDeneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';
import { DenemeCevapRequest, IDenemeCevapRequest } from './denemeCevap.model';
import { DenemeSinavDto, DenemeSoruDto } from './denemeSinav.model';
import { Karistir } from './karistir.model';
import { NgbdModalComponent } from './NgbdModalComponent';

@Component({
  selector: 'jhi-deneme-giris',
  templateUrl: './deneme-giris.component.html',
  styleUrls: ['./deneme-giris.component.scss'],
})
export class DenemeGirisComponent implements OnInit {
  p: number;
  form: FormGroup;
  denemeId: number;
  sinav: DenemeSinavDto;
  foto: string;
  time: number;
  deneme: IDeneme | null = null;

  constructor(
    private fb: FormBuilder,
    private denemeService: DenemeService,
    private route: ActivatedRoute,
    protected router: Router,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {
    this.p = 0;
    this.foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';
  }

  shuffleCevaplar(array: any[]): any[] {
    const karisikdizi: string[] = [];
    const arrayLength = array.length;

    for (let i = 0; i < arrayLength; i++) {
      const item = array[Math.floor(Math.random() * array.length)];
      karisikdizi.push(item);
      array = array.filter((ele: any) => ele !== item);
    }

    return karisikdizi;
  }

  cevapKaristir(soru: DenemeSoruDto): DenemeSoruDto {
    const cevaplar = [soru.a, soru.b, soru.c, soru.d];
    const karisikSoru = this.shuffleCevaplar(cevaplar); // burda sorular karıştirildi
    const karişmisSorular = new Karistir(karisikSoru[0], karisikSoru[1], karisikSoru[2], karisikSoru[3]);
    soru.kar = karişmisSorular;

    return soru;
  }

  /**
   * soruyu tamamlama modal
   */
  open(): void {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      console.log(receivedEntry);
      this.save();
      this.modalService.dismissAll();
    });
  }

  getSorular(id: number): void {
    this.denemeService.getDenemeSinav(id).subscribe(res => {
      this.sinav = res;

      // sorular karıştılıyor
      this.sinav.sorular = this.shuffleArray(this.sinav.sorular);

      for (let index = 0; index < this.sinav.sorular.length; index++) {
        this.addControl(this.sinav.sorular[index].soruId!);
      }
    });
  }

  /**
   * soru karıştırma
   * @param array
   * @returns
   */
  shuffleArray(array: DenemeSoruDto[]): DenemeSoruDto[] {
    const karisikdizi: DenemeSoruDto[] = [];
    const arrayLength = array.length;

    for (let i = 0; i < arrayLength; i++) {
      const item = array[Math.floor(Math.random() * array.length)];

      // cevaplar karisiksa
      if (item.cevapli) {
        karisikdizi.push(this.cevapKaristir(item));
      } else {
        karisikdizi.push(item);
      }

      array = this.arrayRemove(array, item);
    }

    return karisikdizi;
  }

  /**
   * diziden elemen silme
   * @param arr
   * @param value
   * @returns
   */
  arrayRemove(arr: DenemeSoruDto[], value: DenemeSoruDto): DenemeSoruDto[] {
    return arr.filter(function (ele) {
      return ele !== value;
    });
  }

  ngOnInit(): void {
    // parametreleri almak için
    this.route.queryParams.subscribe(params => {
      if (params['sure']) {
        this.time = params['sure'] * 60;
      }
    });

    // urlde slash işaretinden sonrasını almak için
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.getSorular(params['id']);
        this.denemeId = params['id'];
      } else {
        console.log('geldim hata');
      }
    });

    this.form = this.fb.group({
      denemeId: [this.denemeId, { validators: [Validators.required] }],
      sorular: this.fb.array([]),
    });
  }

  /**
   * süre bittiği zaman ekrana alert fırlatıyor
   * @param event gelen durum
   */
  handleEvent(event: any): any {
    if (event.action === 'done') {
      this.alertService.addAlert({ type: 'danger', message: 'Süre bitti' });
    }
  }

  get cevaplarFieldAsFormArray(): any {
    return this.form.get('sorular') as FormArray;
  }

  addControl(id: number): void {
    this.cevaplarFieldAsFormArray.push(this.soruCevap(id));
  }

  soruCevap(id: number): any {
    return this.fb.group({
      cevap: this.fb.control(''),
      soruId: this.fb.control(id),
    });
  }

  gercekCevapBul(cevap: any, soru: any): string {
    let cevapSik;
    // cevabı alarak cevabın string değerini aldık
    switch (cevap) {
      case 'A':
        cevapSik = soru.kar?.a;
        break;
      case 'B':
        cevapSik = soru.kar?.b;
        break;
      case 'C':
        cevapSik = soru.kar?.c;
        break;
      case 'D':
        cevapSik = soru.kar?.d;
        break;
    }

    // cevabın string değeri ile gerçek cevabı getirdik
    switch (cevapSik) {
      case soru.a:
        return 'A';
      case soru.b:
        return 'B';
      case soru.c:
        return 'C';
      case soru.d:
        return 'D';

      default:
        return '';
    }
  }

  cevapDegistir(cevaplar: IDenemeCevapRequest): IDenemeCevapRequest {
    const cloneCevaplar = cevaplar;

    for (let i = 0; i < this.sinav.sorular.length; i++) {
      const cevap = cloneCevaplar.sorular![i];
      const gercekSoru = this.sinav.sorular.find(s => s.soruId === cevap.soruId);

      if(gercekSoru?.cevapli){
                cloneCevaplar.sorular![i].cevap = this.gercekCevapBul(cevap.cevap, gercekSoru);

      }


    }

    return cloneCevaplar;
  }

  save(): void {
    const cevapRequest = new DenemeCevapRequest(this.form.value);
    const duzenlenmisCevapRequest = this.cevapDegistir(cevapRequest);

    this.denemeService.cevaplariGonder(duzenlenmisCevapRequest).subscribe(
      res => {
        this.router.navigate(['deneme-analiz', res, 'view']);
      },
      err => {
        this.alertService.addAlert({ type: 'danger', message: 'serviste hata olustu' });
        console.log(err);
      }
    );
  }
}
