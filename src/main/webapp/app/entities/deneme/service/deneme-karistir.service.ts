import { Injectable } from '@angular/core';
import { ISoru } from 'app/entities/soru/soru.model';
import { IDenemeCevapRequest } from '../deneme-giris/denemeCevap.model';
import { DenemeSinavDto, DenemeSoruDto } from '../deneme-giris/denemeSinav.model';
import { Karistir } from '../deneme-giris/karistir.model';

@Injectable({
  providedIn: 'root',
})
export class DenemeKaristirService {
  /**
   * cevapları karıştır
   * @param array
   * @returns
   */
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

  soruKaristir(sorular: ISoru[], cevapKaristir: boolean): ISoru[] {
    const karisikdizi: ISoru[] = [];
    const arrayLength = sorular.length;

    for (let i = 0; i < arrayLength; i++) {
      const item = sorular[Math.floor(Math.random() * sorular.length)];

      // cevaplar karisiksa
      if (cevapKaristir) {
        karisikdizi.push(this.soruCevapKaristir(item));
      } else {
        karisikdizi.push(item);
      }

      sorular = sorular.filter(e => e !== item);
    }

    return karisikdizi;
  }

  yanlizCevapKaristir(sorular: ISoru[]): ISoru[] {
    const karisikdizi: ISoru[] = [];
    const arrayLength = sorular.length;
    sorular = sorular.sort((a, b) => a.sira! - b.sira!);

    for (let i = 0; i < arrayLength; i++) {
      karisikdizi.push(this.soruCevapKaristir(sorular[i]));
    }

    return karisikdizi;
  }

  soruCevapKaristir(soru: ISoru): ISoru {
    const cevaplar = [soru.a, soru.b, soru.c, soru.d];
    const karisikSoru = this.shuffleCevaplar(cevaplar); // burda sorular karıştirildi
    const cevap = this.cevapBulString(soru.cevap!, soru);
    soru.a = karisikSoru[0];
    soru.b = karisikSoru[1];
    soru.c = karisikSoru[2];
    soru.d = karisikSoru[3];
    soru.cevap = this.yeniCevabıBul(soru.a!, soru.b!, soru.c!, soru.d!, cevap);

    return soru;
  }

  cevapBulString(cevap: string, soru: ISoru): string {
    switch (cevap) {
      case 'A':
        return soru.a!;

      case 'B':
        return soru.b!;

      case 'C':
        return soru.c!;

      case 'D':
        return soru.d!;
      default:
        return '';
    }

    // switch (cevap) {
    //   case soru.a:
    //     return 'A';
    //   case soru.b:
    //     return 'B';
    //   case soru.c:
    //     return 'C';
    //   case soru.d:
    //     return 'D';
    //   default:
    //     return ' ';
    // }
  }

  yeniCevabıBul(a: string, b: string, c: string, d: string, cevap: string): string {
    switch (cevap) {
      case a:
        return 'A';
      case b:
        return 'B';
      case c:
        return 'C';
      case d:
        return 'D';
      default:
        return ' ';
    }
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

  cevapKaristir(soru: DenemeSoruDto): DenemeSoruDto {
    const cevaplar = [soru.a, soru.b, soru.c, soru.d];
    const karisikSoru = this.shuffleCevaplar(cevaplar); // burda sorular karıştirildi
    const karişmisSorular = new Karistir(karisikSoru[0], karisikSoru[1], karisikSoru[2], karisikSoru[3]);
    soru.kar = karişmisSorular;

    return soru;
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

  cevapDegistir(cevaplar: IDenemeCevapRequest, sinavDto: DenemeSinavDto): IDenemeCevapRequest {
    const cloneCevaplar = cevaplar;

    for (let i = 0; i < sinavDto.sorular.length; i++) {
      const cevap = cloneCevaplar.sorular![i];
      const gercekSoru = sinavDto.sorular.find(s => s.soruId === cevap.soruId);

      if (gercekSoru?.cevapli) {
        cloneCevaplar.sorular![i].cevap = this.gercekCevapBul(cevap.cevap, gercekSoru);
      }
    }

    return cloneCevaplar;
  }
}
