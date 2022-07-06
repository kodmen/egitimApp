import { IYurt } from 'app/entities/yurt/yurt.model';
import { IGrup } from 'app/entities/grup/grup.model';
import { IUser } from 'app/entities/user/user.model';

export interface ISinif {
  id?: number;
  isim?: string | null;
  konulimizjson?: string | null;
  yurt?: IYurt | null;
  grup?: IGrup | null;
  hoca?: IUser | null;
  ogrencilers?: IUser[] | null;
}

export class Sinif implements ISinif {
  constructor(
    public id?: number,
    public isim?: string | null,
    public konulimizjson?: string | null,
    public yurt?: IYurt | null,
    public grup?: IGrup | null,
    public hoca?: IUser | null,
    public ogrencilers?: IUser[] | null
  ) {}
}

export function getSinifIdentifier(sinif: ISinif): number | undefined {
  return sinif.id;
}
