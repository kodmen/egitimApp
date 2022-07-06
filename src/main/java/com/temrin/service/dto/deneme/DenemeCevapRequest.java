package com.temrin.service.dto.deneme;

import java.util.List;

public class DenemeCevapRequest {

    private long denemeId;
    private List<DenemeCevapDto> sorular;

    public long getDenemeId() {
        return denemeId;
    }

    public void setDenemeId(long denemeId) {
        this.denemeId = denemeId;
    }

    public List<DenemeCevapDto> getSorular() {
        return sorular;
    }

    public void setSorular(List<DenemeCevapDto> sorular) {
        this.sorular = sorular;
    }
}
