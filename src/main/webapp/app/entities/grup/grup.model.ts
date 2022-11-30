import { IKonu } from "../konu/konu.model";

export interface IGrup {
  id?: number;
  isim?: string | null;
  konular?: IKonu[] | null;
}

export class Grup implements IGrup {
  constructor(public id?: number, public isim?: string | null, public konular?: IKonu[] | null) { }
}

export function getGrupIdentifier(grup: IGrup): number | undefined {
  return grup.id;
}
