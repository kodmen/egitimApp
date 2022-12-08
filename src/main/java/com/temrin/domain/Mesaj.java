package com.temrin.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mesaj.
 */
@Entity
@Table(name = "mesaj")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Mesaj implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "eposta")
    private String eposta;

    @Column(name = "mesaj")
    private String mesaj;

    @Column(name = "goruldu")
    private Boolean goruldu;

    @Column(name = "tarih")
    private LocalDate tarih;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Mesaj id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return this.userName;
    }

    public Mesaj userName(String userName) {
        this.setUserName(userName);
        return this;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEposta() {
        return this.eposta;
    }

    public Mesaj eposta(String eposta) {
        this.setEposta(eposta);
        return this;
    }

    public void setEposta(String eposta) {
        this.eposta = eposta;
    }

    public String getMesaj() {
        return this.mesaj;
    }

    public Mesaj mesaj(String mesaj) {
        this.setMesaj(mesaj);
        return this;
    }

    public void setMesaj(String mesaj) {
        this.mesaj = mesaj;
    }

    public Boolean getGoruldu() {
        return this.goruldu;
    }

    public Mesaj goruldu(Boolean goruldu) {
        this.setGoruldu(goruldu);
        return this;
    }

    public void setGoruldu(Boolean goruldu) {
        this.goruldu = goruldu;
    }

    public LocalDate getTarih() {
        return this.tarih;
    }

    public Mesaj tarih(LocalDate tarih) {
        this.setTarih(tarih);
        return this;
    }

    public void setTarih(LocalDate tarih) {
        this.tarih = tarih;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mesaj)) {
            return false;
        }
        return id != null && id.equals(((Mesaj) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mesaj{" +
            "id=" + getId() +
            ", userName='" + getUserName() + "'" +
            ", eposta='" + getEposta() + "'" +
            ", mesaj='" + getMesaj() + "'" +
            ", goruldu='" + getGoruldu() + "'" +
            ", tarih='" + getTarih() + "'" +
            "}";
    }
}
