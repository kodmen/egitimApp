export class DenemeSoruDto {
    soruResimUrl?: string;
    soruId?: number;
    cevapli?:boolean;
    a?:string;
    b?:string;
    c?:string;
    d?:string;
  }
  
  export class DenemeSinavDto {
    denemeId?: number;
    sorular: DenemeSoruDto[];
  }