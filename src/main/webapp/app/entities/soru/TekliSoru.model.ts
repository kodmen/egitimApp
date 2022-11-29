export interface ITekliSoru {
  name?: string | null;
  type?: string | null;
  image?: string | null;

}

export class TekliSoru implements ITekliSoru {
  constructor(
    public name?: string | null,
    public type?: string | null,
    public image?: string | null
  ) { }
}