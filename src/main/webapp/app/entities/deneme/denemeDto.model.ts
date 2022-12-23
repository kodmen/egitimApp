import dayjs from 'dayjs/esm';
import { IKonuDto } from './konuDto.model';

export interface IDenemeDto {
  rastgele?: boolean | null;
  isim?: string | null;
  baslamaTarih?: dayjs.Dayjs | null;
  sure?: number | null;
  konudto?: IKonuDto[] | null;
  sinifId?:number|null;
}

export class DenemeDto implements IDenemeDto {
  constructor(
    public rastgele?: boolean | null,
    public isim?: string | null,
    public baslamaTarih?: dayjs.Dayjs | null,
    public sure?: number | null,
    public konudto?: IKonuDto[] | null,
    public sinifId?: number |null
  ) {}
}