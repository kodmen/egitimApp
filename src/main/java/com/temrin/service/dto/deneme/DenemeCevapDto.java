package com.temrin.service.dto.deneme;

public class DenemeCevapDto {

    private String cevap;
    private long soruId;

    public String getCevap() {
        return cevap;
    }

    public void setCevap(String cevap) {
        this.cevap = cevap;
    }

    public long getSoruId() {
        return soruId;
    }

    public void setSoruId(long soruId) {
        this.soruId = soruId;
    }
}
