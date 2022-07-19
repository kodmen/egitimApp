package com.temrin.service.dto.deneme;

public class DenemeSoruDto {

    public String soruResimUrl;
    public long soruId;
    public boolean cevapli;
    public String a;
    public String b;
    public String c;
    public String d;

    public DenemeSoruDto(String url, long id) {
        soruId = id;
        soruResimUrl = url;
    }

    public DenemeSoruDto(String url, long id,boolean c) {
        soruId = id;
        soruResimUrl = url;
        cevapli = c;
    }

    public DenemeSoruDto(String soruResimUrl, long soruId, boolean cevapli, String a, String b, String c, String d) {
        this.soruResimUrl = soruResimUrl;
        this.soruId = soruId;
        this.cevapli = cevapli;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    public static DenemeSoruDto creatDenemeSoruDtoCevapsiz(String url, long id){
        return new DenemeSoruDto(url,id,false);
    }

    public static DenemeSoruDto creatDenemeSoruDtoCevapli(String url, long id, String a, String b, String c, String d){
        return new DenemeSoruDto(url,id,true,a,b,c,d);
    }

    public boolean isCevapli() {
        return cevapli;
    }

    public void setCevapli(boolean cevapli) {
        this.cevapli = cevapli;
    }

    public String getA() {
        return a;
    }

    public void setA(String a) {
        this.a = a;
    }

    public String getB() {
        return b;
    }

    public void setB(String b) {
        this.b = b;
    }

    public String getC() {
        return c;
    }

    public void setC(String c) {
        this.c = c;
    }

    public String getD() {
        return d;
    }

    public void setD(String d) {
        this.d = d;
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
