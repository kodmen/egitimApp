import { IKonu } from 'app/entities/konu/konu.model';
import { IDeneme } from 'app/entities/deneme/deneme.model';
import { IDonem } from '../donem/donem.model';

export interface ISoru {
  id?: number;
  isim?: string | null;
  metin?: string | null;
  cevap?: string | null;
  sira?: number | null;
  resimUrl?: string | null;
  a?: string | null;
  b?: string | null;
  c?: string | null;
  d?: string | null;
  cevapli?: boolean | null;
  gozuksun?: boolean | null;
  konu?: IKonu | null;
  donem?: IDonem |null;
  imageContentType?: string | null;
  image?: string | null;
  denemelers?: IDeneme[] | null;
}

export class Soru implements ISoru {
  constructor(
    public id?: number,
    public isim?: string | null,
    public metin?: string | null,
    public cevap?: string | null,
    public sira?: number | null,
    public resimUrl?: string | null,
    public a?: string | null,
    public b?: string | null,
    public c?: string | null,
    public d?: string | null,
    public cevapli?: boolean | null,
    public gozuksun?: boolean | null,
    public konu?: IKonu | null,
    public donem?: IDonem | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public denemelers?: IDeneme[] | null
  ) {
    this.cevapli = this.cevapli ?? false;
    this.gozuksun = this.gozuksun ?? false;
  }
}

export function getSoruIdentifier(soru: ISoru): number | undefined {
  return soru.id;
}
