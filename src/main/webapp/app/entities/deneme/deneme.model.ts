import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ISoru } from 'app/entities/soru/soru.model';

export interface IDeneme {
  id?: number;
  isim?: string | null;
  olusturmaTarih?: dayjs.Dayjs | null;
  baslamaTarih?: dayjs.Dayjs | null;
  sure?: number | null;
  cevapAnahtar?: string | null;
  denemeInfoJson?: string | null;
  olusturan?: IUser | null;
  sorulars?: ISoru[] | null;
}

export class Deneme implements IDeneme {
  constructor(
    public id?: number,
    public isim?: string | null,
    public olusturmaTarih?: dayjs.Dayjs | null,
    public baslamaTarih?: dayjs.Dayjs | null,
    public sure?: number | null,
    public cevapAnahtar?: string | null,
    public denemeInfoJson?: string | null,
    public olusturan?: IUser | null,
    public sorulars?: ISoru[] | null
  ) {}
}

export function getDenemeIdentifier(deneme: IDeneme): number | undefined {
  return deneme.id;
}
