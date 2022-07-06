package com.temrin.service.dto.deneme;

public class DenemeSoruDto {

    public String soruResimUrl;
    public long soruId;

    public DenemeSoruDto(String url, long id) {
        soruId = id;
        soruResimUrl = url;
    }

    public String getSoruResimUrl() {
        return soruResimUrl;
    }

    public void setSoruResimUrl(String soruResimUrl) {
        this.soruResimUrl = soruResimUrl;
    }

    public long getSoruId() {
        return soruId;
    }

    public void setSoruId(long soruId) {
        this.soruId = soruId;
    }
}
