package com.temrin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Deneme.
 */
@Entity
@Table(name = "deneme")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Deneme implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 500)
    @Column(name = "isim", length = 500)
    private String isim;

    @Column(name = "olusturma_tarih")
    private LocalDate olusturmaTarih;

    @Column(name = "baslama_tarih")
    private Instant baslamaTarih;

    @Column(name = "sure")
    private Integer sure;

    @Size(max = 500)
    @Column(name = "cevap_anahtar", length = 500)
    private String cevapAnahtar;

    @Size(max = 5000)
    @Column(name = "deneme_info_json", length = 5000)
    private String denemeInfoJson;

    @ManyToOne
    private User olusturan;

    @ManyToMany
    @JoinTable(
        name = "rel_deneme__sorular",
        joinColumns = @JoinColumn(name = "deneme_id"),
        inverseJoinColumns = @JoinColumn(name = "sorular_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "konu", "denemelers" }, allowSetters = true)
    private Set<Soru> sorulars = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Deneme id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsim() {
        return this.isim;
    }

    public Deneme isim(String isim) {
        this.setIsim(isim);
        return this;
    }

    public void setIsim(String isim) {
        this.isim = isim;
    }

    public LocalDate getOlusturmaTarih() {
        return this.olusturmaTarih;
    }

    public Deneme olusturmaTarih(LocalDate olusturmaTarih) {
        this.setOlusturmaTarih(olusturmaTarih);
        return this;
    }

    public void setOlusturmaTarih(LocalDate olusturmaTarih) {
        this.olusturmaTarih = olusturmaTarih;
    }

    public Instant getBaslamaTarih() {
        return this.baslamaTarih;
    }

    public Deneme baslamaTarih(Instant baslamaTarih) {
        this.setBaslamaTarih(baslamaTarih);
        return this;
    }

    public void setBaslamaTarih(Instant baslamaTarih) {
        this.baslamaTarih = baslamaTarih;
    }

    public Integer getSure() {
        return this.sure;
    }

    public Deneme sure(Integer sure) {
        this.setSure(sure);
        return this;
    }

    public void setSure(Integer sure) {
        this.sure = sure;
    }

    public String getCevapAnahtar() {
        return this.cevapAnahtar;
    }

    public Deneme cevapAnahtar(String cevapAnahtar) {
        this.setCevapAnahtar(cevapAnahtar);
        return this;
    }

    public void setCevapAnahtar(String cevapAnahtar) {
        this.cevapAnahtar = cevapAnahtar;
    }

    public String getDenemeInfoJson() {
        return this.denemeInfoJson;
    }

    public Deneme denemeInfoJson(String denemeInfoJson) {
        this.setDenemeInfoJson(denemeInfoJson);
        return this;
    }

    public void setDenemeInfoJson(String denemeInfoJson) {
        this.denemeInfoJson = denemeInfoJson;
    }

    public User getOlusturan() {
        return this.olusturan;
    }

    public void setOlusturan(User user) {
        this.olusturan = user;
    }

    public Deneme olusturan(User user) {
        this.setOlusturan(user);
        return this;
    }

    public Set<Soru> getSorulars() {
        return this.sorulars;
    }

    public void setSorulars(Set<Soru> sorus) {
        this.sorulars = sorus;
    }

    public Deneme sorulars(Set<Soru> sorus) {
        this.setSorulars(sorus);
        return this;
    }

    public Deneme addSorular(Soru soru) {
        this.sorulars.add(soru);
        soru.getDenemelers().add(this);
        return this;
    }

    public Deneme removeSorular(Soru soru) {
        this.sorulars.remove(soru);
        soru.getDenemelers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Deneme)) {
            return false;
        }
        return id != null && id.equals(((Deneme) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Deneme{" +
            "id=" + getId() +
            ", isim='" + getIsim() + "'" +
            ", olusturmaTarih='" + getOlusturmaTarih() + "'" +
            ", baslamaTarih='" + getBaslamaTarih() + "'" +
            ", sure=" + getSure() +
            ", cevapAnahtar='" + getCevapAnahtar() + "'" +
            ", denemeInfoJson='" + getDenemeInfoJson() + "'" +
            "}";
    }
}
