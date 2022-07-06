export interface IGrup {
  id?: number;
  isim?: string | null;
}

export class Grup implements IGrup {
  constructor(public id?: number, public isim?: string | null) {}
}

export function getGrupIdentifier(grup: IGrup): number | undefined {
  return grup.id;
}
