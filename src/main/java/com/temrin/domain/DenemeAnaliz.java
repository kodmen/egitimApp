package com.temrin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DenemeAnaliz.
 */
@Entity
@Table(name = "deneme_analiz")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DenemeAnaliz implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "dogru")
    private Integer dogru;

    @Column(name = "yanlis")
    private Integer yanlis;

    @Column(name = "puan")
    private Integer puan;

    @Column(name = "cozuldu")
    private Boolean cozuldu;

    @Size(max = 5000)
    @Column(name = "konu_analiz_json", length = 5000)
    private String konuAnalizJson;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "olusturan", "sorulars" }, allowSetters = true)
    private Deneme deneme;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DenemeAnaliz id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDogru() {
        return this.dogru;
    }

    public DenemeAnaliz dogru(Integer dogru) {
        this.setDogru(dogru);
        return this;
    }

    public void setDogru(Integer dogru) {
        this.dogru = dogru;
    }

    public Integer getYanlis() {
        return this.yanlis;
    }

    public DenemeAnaliz yanlis(Integer yanlis) {
        this.setYanlis(yanlis);
        return this;
    }

    public void setYanlis(Integer yanlis) {
        this.yanlis = yanlis;
    }

    public Integer getPuan() {
        return this.puan;
    }

    public DenemeAnaliz puan(Integer puan) {
        this.setPuan(puan);
        return this;
    }

    public void setPuan(Integer puan) {
        this.puan = puan;
    }

    public Boolean getCozuldu() {
        return this.cozuldu;
    }

    public DenemeAnaliz cozuldu(Boolean cozuldu) {
        this.setCozuldu(cozuldu);
        return this;
    }

    public void setCozuldu(Boolean cozuldu) {
        this.cozuldu = cozuldu;
    }

    public String getKonuAnalizJson() {
        return this.konuAnalizJson;
    }

    public DenemeAnaliz konuAnalizJson(String konuAnalizJson) {
        this.setKonuAnalizJson(konuAnalizJson);
        return this;
    }

    public void setKonuAnalizJson(String konuAnalizJson) {
        this.konuAnalizJson = konuAnalizJson;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DenemeAnaliz user(User user) {
        this.setUser(user);
        return this;
    }

    public Deneme getDeneme() {
        return this.deneme;
    }

    public void setDeneme(Deneme deneme) {
        this.deneme = deneme;
    }

    public DenemeAnaliz deneme(Deneme deneme) {
        this.setDeneme(deneme);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DenemeAnaliz)) {
            return false;
        }
        return id != null && id.equals(((DenemeAnaliz) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DenemeAnaliz{" +
            "id=" + getId() +
            ", dogru=" + getDogru() +
            ", yanlis=" + getYanlis() +
            ", puan=" + getPuan() +
            ", cozuldu='" + getCozuldu() + "'" +
            ", konuAnalizJson='" + getKonuAnalizJson() + "'" +
            "}";
    }
}
