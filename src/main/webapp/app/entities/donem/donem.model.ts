export interface IDonem {
  id?: number;
  isim?: string | null;
}

export class Donem implements IDonem {
  constructor(public id?: number, public isim?: string | null) {}
}

export function getDonemIdentifier(donem: IDonem): number | undefined {
  return donem.id;
}
