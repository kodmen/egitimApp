package com.temrin.service.dto;

public class KonuDTO {

    public int konu;
    public int baslangic;
    public int soruSayisi;
    public int bitis;

    public int getKonu() {
        return konu;
    }

    public void setKonu(int konu) {
        this.konu = konu;
    }

    public int getBaslangic() {
        return baslangic;
    }

    public void setBaslangic(int baslangic) {
        this.baslangic = baslangic;
    }

    public int getSoruSayisi() {
        return soruSayisi;
    }

    public void setSoruSayisi(int soruSayisi) {
        this.soruSayisi = soruSayisi;
    }

    public int getBitis() {
        return bitis;
    }

    public void setBitis(int bitis) {
        this.bitis = bitis;
    }
}
