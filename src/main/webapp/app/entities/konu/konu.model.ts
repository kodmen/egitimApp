export interface IKonu {
  id?: number;
  isim?: string | null;
  soruSayisi?:number |null ;
}

export class Konu implements IKonu {
  constructor(public id?: number, public isim?: string | null,public soruSayisi?:number | null) {}
}

export function getKonuIdentifier(konu: IKonu): number | undefined {
  return konu.id;
}
