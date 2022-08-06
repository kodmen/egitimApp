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
  foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';

  tekCevap = false;
  tekCevapYazi = '';
  scoreD = 0;
  scoreY = 0;
  count: number;
  bekleDurum = true;

  p: number;
  konularSharedCollection: IKonu[] = [];
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
    this.p = 1;
  }

  pageChanged(event: any): void {
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

  geri(): void {
    this.form.get(['konu'])!.setValue('');
    this.form.get(['soruKaristir'])!.setValue(false);
    this.form.get(['cevapKaristir'])!.setValue(false);
    this.soruVarmi = false;
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
    if (!this.tekCevap) {
      if (soru.cevap === c) {
        this.tekCevap = true;
        this.tekCevapYazi = 'DOĞRU';
        this.statusDegistir(soru.cevap);
        this.scoreD++;
      } else {
        this.scoreY++;
        this.tekCevap = true;
        this.tekCevapYazi = 'YANLIŞ';
        this.statusDegistir(soru.cevap!);
      }
    }
  }

  cevaprenkDegistirA(): string {
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
  }

  statusDegistir(c: string): void {
    switch (c) {
      case 'A':
        this.cevaprenk('d', 'y', 'y', 'y');
        break;
      case 'B':
        this.cevaprenk('y', 'd', 'y', 'y');
        break;
      case 'C':
        this.cevaprenk('y', 'y', 'd', 'y');
        break;
      case 'D':
        this.cevaprenk('y', 'y', 'y', 'd');
        break;

      default:
        break;
    }
  }

  getSoruClass(): any {
    if (this.tekCevap) {
      if (this.tekCevapYazi === 'DOĞRU') {
        return 'border-3 border border-success ';
      } else {
        return 'border-3 border border-danger ';
      }
    }
  }
}
