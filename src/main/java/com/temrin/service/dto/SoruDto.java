package com.temrin.service.dto;

import com.temrin.domain.Konu;

import javax.persistence.Lob;

public class SoruDto {

    public Long id;
    public String isim;
    public String cevap;
    public Integer sira;
    public String resimUrl;
    public Konu konu;

    @Lob
    private byte[] image;

    private String imageContentType;

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsim() {
        return isim;
    }

    public void setIsim(String isim) {
        this.isim = isim;
    }

    public String getCevap() {
        return cevap;
    }

    public void setCevap(String cevap) {
        this.cevap = cevap;
    }

    public Integer getSira() {
        return sira;
    }

    public void setSira(Integer sira) {
        this.sira = sira;
    }

    public String getResimUrl() {
        return resimUrl;
    }

    public void setResimUrl(String resimUrl) {
        this.resimUrl = resimUrl;
    }

    public Konu getKonu() {
        return konu;
    }

    public void setKonu(Konu konu) {
        this.konu = konu;
    }
}
