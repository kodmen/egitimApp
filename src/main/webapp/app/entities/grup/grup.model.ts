import { IKonu } from '../konu/konu.model';

export interface IGrup {
  id?: number;
  isim?: string | null;
  konular?: IKonu[] | null;
  gozuksun?: boolean | null;
}

export class Grup implements IGrup {
  constructor(public id?: number, public isim?: string | null, public konular?: IKonu[] | null,public gozuksun?:boolean|null) {
    this.gozuksun = this.gozuksun ?? false;
  }
}

export function getGrupIdentifier(grup: IGrup): number | undefined {
  return grup.id;
}
