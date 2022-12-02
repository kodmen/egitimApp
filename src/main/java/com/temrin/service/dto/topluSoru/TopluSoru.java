package com.temrin.service.dto.topluSoru;

import com.temrin.domain.Donem;
import com.temrin.domain.Konu;

import java.util.List;

public class TopluSoru {
    private Konu konu;
    private Donem donem;
    private boolean cevapli;
    private List<TekliSoru> sorular;
    private String metinliSorular;

    public String getMetinliSorular() {
        return metinliSorular;
    }

    public void setMetinliSorular(String metinliSorular) {
        this.metinliSorular = metinliSorular;
    }

    public Konu getKonu() {
        return konu;
    }

    public void setKonu(Konu konu) {
        this.konu = konu;
    }

    public Donem getDonem() {
        return donem;
    }

    public void setDonem(Donem donem) {
        this.donem = donem;
    }

    public boolean isCevapli() {
        return cevapli;
    }

    public void setCevapli(boolean cevapli) {
        this.cevapli = cevapli;
    }

    public List<TekliSoru> getSorular() {
        return sorular;
    }

    public void setSorular(List<TekliSoru> sorular) {
        this.sorular = sorular;
    }
}
