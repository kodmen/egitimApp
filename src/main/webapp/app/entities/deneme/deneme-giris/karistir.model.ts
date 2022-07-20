export class Karistir {
  a?: string;
  b?: string;
  c?: string;
  d?: string;

  constructor(ac?: string, bc?: string, cc?: string, dc?: string) {
    this.a = ac;
    this.b = bc;
    this.c = cc;
    this.d = dc;
  }

 

  cevapGetir(cevap: string): string {
    switch (cevap) {
      case 'A':
        return this.a!;
      case 'B':
        return this.b!;
      case 'C':
        return this.c!;
      case 'D':
        return this.d!;
      default:
        return 'bos';
    }
  }

}
