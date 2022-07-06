import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ISoru } from 'app/entities/soru/soru.model';
import { IKonu } from '../konu/konu.model';

export interface IKonuDto {
  soruSayisi?: number;
  baslangic?: number;
  bitis?: number;
  konu?: number | null;
}

export class KonuDto implements IKonuDto {
  constructor(public soruSayisi?: number, public baslangic?: number, public bitis?: number, public konu?: number | null) {}
}