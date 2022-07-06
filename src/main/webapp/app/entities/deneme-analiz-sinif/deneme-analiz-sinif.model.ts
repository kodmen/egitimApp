import { IDeneme } from 'app/entities/deneme/deneme.model';
import { ISinif } from 'app/entities/sinif/sinif.model';

export interface IDenemeAnalizSinif {
  id?: number;
  ortalama?: number | null;
  konuAnalizJson?: string | null;
  deneme?: IDeneme | null;
  sinif?: ISinif | null;
}

export class DenemeAnalizSinif implements IDenemeAnalizSinif {
  constructor(
    public id?: number,
    public ortalama?: number | null,
    public konuAnalizJson?: string | null,
    public deneme?: IDeneme | null,
    public sinif?: ISinif | null
  ) {}
}

export function getDenemeAnalizSinifIdentifier(denemeAnalizSinif: IDenemeAnalizSinif): number | undefined {
  return denemeAnalizSinif.id;
}
