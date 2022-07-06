import dayjs from 'dayjs/esm';
import { IKonuDto } from './konuDto.model';

export interface IDenemeDto {
  rastgele?: boolean | null;
  isim?: string | null;
  tarih?: dayjs.Dayjs | null;
  sure?: number | null;
  konudto?: IKonuDto[] | null;
}

export class DenemeDto implements IDenemeDto {
  public constructor(init?: Partial<DenemeDto>) {
    Object.assign(this, init);
  }
}