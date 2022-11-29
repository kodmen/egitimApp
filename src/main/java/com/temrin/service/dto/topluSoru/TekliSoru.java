package com.temrin.service.dto.topluSoru;

import javax.persistence.Lob;

public class TekliSoru {
    private String name;
    @Lob
    private byte[] image;
    private String type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
