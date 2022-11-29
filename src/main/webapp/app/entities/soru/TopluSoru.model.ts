import { IDonem } from "../donem/donem.model";
import { IKonu } from "../konu/konu.model";
import { ITekliSoru } from "./TekliSoru.model";

export interface ITopluSoru {
    cevapli?: boolean | null;
    konu?: IKonu | null;
    donem?: IDonem | null;
    sorular?: ITekliSoru[] | null;
}

export class TopluSoru implements ITopluSoru {
    constructor(
        public cevapli?: boolean | null,
        public konu?: IKonu | null,
        public donem?: IDonem | null,
        public sorular?: ITekliSoru[] | null,
    ) { }
}