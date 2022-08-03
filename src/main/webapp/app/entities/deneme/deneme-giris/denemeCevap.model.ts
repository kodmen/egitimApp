export interface DenemeCevapDto {
    cevap?: string;
    soruId?: number;
  }
  
  export interface IDenemeCevapRequest {
    sure?:number;
    denemeId?: number;
    sorular?: DenemeCevapDto[];
  }
  
  export class DenemeCevapRequest implements IDenemeCevapRequest {
    public constructor(init?: Partial<DenemeCevapRequest>) {
      Object.assign(this, init);
    }
  }
  