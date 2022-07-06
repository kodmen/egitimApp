package com.temrin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Soru.
 */
@Entity
@Table(name = "soru")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Soru implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 500)
    @Column(name = "isim", length = 500)
    private String isim;

    @Column(name = "cevap")
    private String cevap;

    @Column(name = "sira")
    private Integer sira;

    @Size(max = 500)
    @Column(name = "resim_url", length = 500)
    private String resimUrl;

    @ManyToOne
    private Konu konu;

    @ManyToMany(mappedBy = "sorulars")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "olusturan", "sorulars" }, allowSetters = true)
    private Set<Deneme> denemelers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Soru id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsim() {
        return this.isim;
    }

    public Soru isim(String isim) {
        this.setIsim(isim);
        return this;
    }

    public void setIsim(String isim) {
        this.isim = isim;
    }

    public String getCevap() {
        return this.cevap;
    }

    public Soru cevap(String cevap) {
        this.setCevap(cevap);
        return this;
    }

    public void setCevap(String cevap) {
        this.cevap = cevap;
    }

    public Integer getSira() {
        return this.sira;
    }

    public Soru sira(Integer sira) {
        this.setSira(sira);
        return this;
    }

    public void setSira(Integer sira) {
        this.sira = sira;
    }

    public String getResimUrl() {
        return this.resimUrl;
    }

    public Soru resimUrl(String resimUrl) {
        this.setResimUrl(resimUrl);
        return this;
    }

    public void setResimUrl(String resimUrl) {
        this.resimUrl = resimUrl;
    }

    public Konu getKonu() {
        return this.konu;
    }

    public void setKonu(Konu konu) {
        this.konu = konu;
    }

    public Soru konu(Konu konu) {
        this.setKonu(konu);
        return this;
    }

    public Set<Deneme> getDenemelers() {
        return this.denemelers;
    }

    public void setDenemelers(Set<Deneme> denemes) {
        if (this.denemelers != null) {
            this.denemelers.forEach(i -> i.removeSorular(this));
        }
        if (denemes != null) {
            denemes.forEach(i -> i.addSorular(this));
        }
        this.denemelers = denemes;
    }

    public Soru denemelers(Set<Deneme> denemes) {
        this.setDenemelers(denemes);
        return this;
    }

    public Soru addDenemeler(Deneme deneme) {
        this.denemelers.add(deneme);
        deneme.getSorulars().add(this);
        return this;
    }

    public Soru removeDenemeler(Deneme deneme) {
        this.denemelers.remove(deneme);
        deneme.getSorulars().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Soru)) {
            return false;
        }
        return id != null && id.equals(((Soru) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Soru{" +
            "id=" + getId() +
            ", isim='" + getIsim() + "'" +
            ", cevap='" + getCevap() + "'" +
            ", sira=" + getSira() +
            ", resimUrl='" + getResimUrl() + "'" +
            "}";
    }
}
