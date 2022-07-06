import { IUser } from 'app/entities/user/user.model';
import { IDeneme } from 'app/entities/deneme/deneme.model';

export interface IDenemeAnaliz {
  id?: number;
  dogru?: number | null;
  yanlis?: number | null;
  puan?: number | null;
  cozuldu?: boolean | null;
  konuAnalizJson?: string | null;
  user?: IUser | null;
  deneme?: IDeneme | null;
}

export class DenemeAnaliz implements IDenemeAnaliz {
  constructor(
    public id?: number,
    public dogru?: number | null,
    public yanlis?: number | null,
    public puan?: number | null,
    public cozuldu?: boolean | null,
    public konuAnalizJson?: string | null,
    public user?: IUser | null,
    public deneme?: IDeneme | null
  ) {
    this.cozuldu = this.cozuldu ?? false;
  }
}

export function getDenemeAnalizIdentifier(denemeAnaliz: IDenemeAnaliz): number | undefined {
  return denemeAnaliz.id;
}
