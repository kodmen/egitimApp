export class DenemeSoruDto {
    soruResimUrl?: string;
    soruId?: number;
  }
  
  export class DenemeSinavDto {
    denemeId?: number;
    sorular: DenemeSoruDto[];
  }