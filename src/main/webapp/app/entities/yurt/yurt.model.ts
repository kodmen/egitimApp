import { IUser } from 'app/entities/user/user.model';

export interface IYurt {
  id?: number;
  isim?: string | null;
  mesul?: IUser | null;
}

export class Yurt implements IYurt {
  constructor(public id?: number, public isim?: string | null, public mesul?: IUser | null) {}
}

export function getYurtIdentifier(yurt: IYurt): number | undefined {
  return yurt.id;
}
