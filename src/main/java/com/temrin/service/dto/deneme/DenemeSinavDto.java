package com.temrin.service.dto.deneme;

import java.util.List;

public class DenemeSinavDto {

    public String olusturan;
    public long denemeId;
    public List<DenemeSoruDto> sorular;

    public String getOlusturan() {
        return olusturan;
    }

    public void setOlusturan(String olusturan) {
        this.olusturan = olusturan;
    }

    public long getDenemeId() {
        return denemeId;
    }

    public void setDenemeId(long denemeId) {
        this.denemeId = denemeId;
    }

    public List<DenemeSoruDto> getSorular() {
        return sorular;
    }

    public void setSorular(List<DenemeSoruDto> sorular) {
        this.sorular = sorular;
    }
}
