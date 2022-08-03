import { IUser } from "app/admin/user-management/user-management.model";

export interface IDenemeAnalizSiralamaDto {
  sure?: number | null;
  puan?: number | null;
  yurt?: string | null;
  user?: IUser | null;
}

export class DenemeAnalizSiralamaDto implements IDenemeAnalizSiralamaDto {
  constructor(public sure?: number | null, public puan?: number | null, public yurt?: string | null, public user?: IUser | null) {}
}
