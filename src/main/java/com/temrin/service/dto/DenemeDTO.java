package com.temrin.service.dto;

import java.time.Instant;
import java.util.List;

public class DenemeDTO {

    public String isim;
    public Instant baslamaTarih;
    public int sure;
    public List<KonuDTO> konudto;
    public boolean rastgele;

    public Instant getBaslamaTarih() {
        return baslamaTarih;
    }

    public void setBaslamaTarih(Instant baslamaTarih) {
        this.baslamaTarih = baslamaTarih;
    }

    public String getIsim() {
        return isim;
    }

    public void setIsim(String isim) {
        this.isim = isim;
    }

    public int getSure() {
        return sure;
    }

    public void setSure(int sure) {
        this.sure = sure;
    }

    public List<KonuDTO> getKonudto() {
        return konudto;
    }

    public void setKonudto(List<KonuDTO> konudto) {
        this.konudto = konudto;
    }

    public boolean isRastgele() {
        return rastgele;
    }

    public void setRastgele(boolean rastgele) {
        this.rastgele = rastgele;
    }
}
