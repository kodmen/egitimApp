import dayjs from 'dayjs/esm';

export interface IMesaj {
  id?: number;
  userName?: string | null;
  eposta?: string | null;
  mesaj?: string | null;
  goruldu?: boolean | null;
  tarih?: dayjs.Dayjs | null;
}

export class Mesaj implements IMesaj {
  constructor(
    public id?: number,
    public userName?: string | null,
    public eposta?: string | null,
    public mesaj?: string | null,
    public goruldu?: boolean | null,
    public tarih?: dayjs.Dayjs | null
  ) {
    this.goruldu = this.goruldu ?? false;
  }
}

export function getMesajIdentifier(mesaj: IMesaj): number | undefined {
  return mesaj.id;
}
