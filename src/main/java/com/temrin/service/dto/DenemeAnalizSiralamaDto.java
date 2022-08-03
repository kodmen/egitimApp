package com.temrin.service.dto;

import com.temrin.domain.User;

public class DenemeAnalizSiralamaDto {
    public User user;
    public int puan;
    public int sure;
    public String yurt;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getPuan() {
        return puan;
    }

    public void setPuan(int puan) {
        this.puan = puan;
    }

    public int getSure() {
        return sure;
    }

    public void setSure(int sure) {
        this.sure = sure;
    }

    public String getYurt() {
        return yurt;
    }

    public void setYurt(String yurt) {
        this.yurt = yurt;
    }
}
