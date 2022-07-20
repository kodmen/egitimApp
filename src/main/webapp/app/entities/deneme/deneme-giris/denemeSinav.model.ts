import { Karistir } from "./karistir.model";

export class DenemeSoruDto {
    soruResimUrl?: string;
    soruId?: number;
    cevapli?:boolean;
    a?:string;
    b?:string;
    c?:string;
    d?:string;
    kar?:Karistir;
  }
  
  export class DenemeSinavDto {
    denemeId?: number;
    sorular: DenemeSoruDto[];
  }