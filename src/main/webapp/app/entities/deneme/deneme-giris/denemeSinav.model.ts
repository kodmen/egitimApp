import { Karistir } from "./karistir.model";

export class DenemeSoruDto {
    soruResimUrl?: string;
    metin?: string;
    soruId?: number;
    cevapli?:boolean;
    a?:string;
    b?:string;
    c?:string;
    d?:string;
    kar?:Karistir;
  }
  
  export class DenemeSinavDto {
    olusturan?:string;
    denemeId?: number;
    sorular: DenemeSoruDto[];
  }