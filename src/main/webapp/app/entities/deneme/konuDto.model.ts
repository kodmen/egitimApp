
export interface IKonuDto {
  soruSayisi?: number;
  baslangic?: number;
  bitis?: number;
  konu?: number | null;
}

export class KonuDto implements IKonuDto {
  constructor(public soruSayisi?: number, public baslangic?: number, public bitis?: number, public konu?: number | null) {}
}