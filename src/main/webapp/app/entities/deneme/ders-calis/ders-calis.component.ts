import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';
import { SoruService } from 'app/entities/soru/service/soru.service';
import { ISoru } from 'app/entities/soru/soru.model';
import { DenemeKaristirService } from '../service/deneme-karistir.service';

@Component({
  selector: 'jhi-ders-calis',
  templateUrl: './ders-calis.component.html',
  styleUrls: ['./ders-calis.component.scss'],
})
export class DersCalisComponent implements OnInit {
  @Output() pageChange: EventEmitter<number>;

  form: FormGroup;

  defaultImage = '../../../../content/images/loading.gif';
  tekCevap = false;
  tekCevapYazi = '';
  score = 0;
  count: number;
  bekleDurum = true;
  p: number;
  konularSharedCollection: IKonu[] = [];
  foto: string;
  soruList?: ISoru[] | null = null;
  soruVarmi = false;


  cevapA: string;
  cevapB: string;
  cevapC: string;
  cevapD: string;

  constructor(
    protected karistirService: DenemeKaristirService,
    protected fb: FormBuilder,
    protected konuService: KonuService,
    protected soruService: SoruService
  ) {
    this.form = this.fb.group({
      konu: ['', Validators.required],
      soruKaristir: [false],
      cevapKaristir: [false],
    });
    this.p = 0;
    this.foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';
  }

  pageChanged(event: any): void {
    console.log(event);
    this.tekCevap = false;
    this.cevapA = 'b';
    this.cevapB = 'b';
    this.cevapC = 'b';
    this.cevapD = 'b';
  }

  soruGetir(): void {
    const konuId = this.form.get(['konu'])!.value;
    const soruKaristir = this.form.get(['soruKaristir'])!.value;
    const cevapKaristir = this.form.get(['cevapKaristir'])!.value;

    this.soruService.getSoruByKonu(konuId).subscribe(res => {
      if (soruKaristir) {
        this.soruList = this.karistirService.soruKaristir(res.body!, cevapKaristir);
      } else if (cevapKaristir) {
        this.soruList = this.karistirService.yanlizCevapKaristir(res.body!);
      } else {
        this.soruList = res.body?.sort((a, b) => a.sira! - b.sira!);
      }

      this.soruVarmi = true;
    });
  }

  geri():void{
    this.form.get(['konu'])!.setValue("")
    this.form.get(['soruKaristir'])!.setValue(false)
     this.form.get(['cevapKaristir'])!.setValue(false)
     this.soruVarmi= false
     this.p = 1;
  }

  getKonu(): any {
    this.konuService.query().subscribe(res => {
      this.konularSharedCollection = res.body ?? [];
    });
  }

  ngOnInit(): void {
    this.count = 0;
    this.getKonu();
  }

  cevapSoru(soru: ISoru, c: string): void {
    if (soru.cevap === c) {
      this.tekCevap = true;
      this.tekCevapYazi = 'başarılı doğru cevap';
      this.statusDegistir(soru.cevap);
    } else {
      this.tekCevap = true;
      this.tekCevapYazi = 'malesef yanlış cevap';
      this.statusDegistir(soru.cevap!);
    }
  }

  cevaprenkDegistirA(): string {
    console.log('cevap a', this.cevapA);

    switch (this.cevapA) {
      case 'b':
        return ' ';
      case 'd':
        return 'bg-success';
      case 'y':
        return 'bg-danger';
      default:
        return ' ';
    }
  }
  cevaprenkDegistirB(): string {
    console.log('cevap b', this.cevapB);

    switch (this.cevapB) {
      case 'b':
        return '';
      case 'd':
        return 'bg-success';
      case 'y':
        return 'bg-danger';
      default:
        return ' ';
    }
  }
  cevaprenkDegistirC(): string {
    console.log('cevap c', this.cevapC);

    switch (this.cevapC) {
      case 'b':
        return '';
      case 'd':
        return 'bg-success';
      case 'y':
        return 'bg-danger';
      default:
        return ' ';
    }
  }
  cevaprenkDegistirD(): string {
    console.log('cevap d', this.cevapD);

    switch (this.cevapD) {
      case 'b':
        return '';
      case 'd':
        return 'bg-success';
      case 'y':
        return 'bg-danger';
      default:
        return ' ';
    }
  }

  cevaprenk(a: string, b: string, c: string, d: string): void {
    this.cevapA = a;
    this.cevapB = b;
    this.cevapC = c;
    this.cevapD = d;
    console.log('cevaplar ', this.cevapA, this.cevapB, this.cevapC, this.cevapD);
  }

  statusDegistir(c: string): void {
    console.log('status değistir ', c);

    switch (c) {
      case 'A':
        console.log('d', 'y', 'y', 'y');

        this.cevaprenk('d', 'y', 'y', 'y');
        break;
      case 'B':
        console.log('y', 'd', 'y', 'y');

        this.cevaprenk('y', 'd', 'y', 'y');
        break;
      case 'C':
        console.log('y', 'y', 'd', 'y');

        this.cevaprenk('y', 'y', 'd', 'y');
        break;
      case 'D':
        console.log('y', 'y', 'y', 'd');

        this.cevaprenk('y', 'y', 'y', 'd');
        break;

      default:
        break;
    }
  }

  getSoruClass(): any {
    if (this.tekCevap) {
      if (this.tekCevapYazi === 'başarılı doğru cevap') {
        return 'border-3 border border-success';
      } else {
        return 'border-3 border border-danger';
      }
    }
  }
}
