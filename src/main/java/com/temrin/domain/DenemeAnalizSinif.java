package com.temrin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DenemeAnalizSinif.
 */
@Entity
@Table(name = "deneme_analiz_sinif")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DenemeAnalizSinif implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ortalama")
    private Float ortalama;

    @Size(max = 5000)
    @Column(name = "konu_analiz_json", length = 5000)
    private String konuAnalizJson;

    @ManyToOne
    @JsonIgnoreProperties(value = { "olusturan", "sorulars" }, allowSetters = true)
    private Deneme deneme;

    @ManyToOne
    @JsonIgnoreProperties(value = { "yurt", "grup", "hoca", "ogrencilers" }, allowSetters = true)
    private Sinif sinif;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DenemeAnalizSinif id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getOrtalama() {
        return this.ortalama;
    }

    public DenemeAnalizSinif ortalama(Float ortalama) {
        this.setOrtalama(ortalama);
        return this;
    }

    public void setOrtalama(Float ortalama) {
        this.ortalama = ortalama;
    }

    public String getKonuAnalizJson() {
        return this.konuAnalizJson;
    }

    public DenemeAnalizSinif konuAnalizJson(String konuAnalizJson) {
        this.setKonuAnalizJson(konuAnalizJson);
        return this;
    }

    public void setKonuAnalizJson(String konuAnalizJson) {
        this.konuAnalizJson = konuAnalizJson;
    }

    public Deneme getDeneme() {
        return this.deneme;
    }

    public void setDeneme(Deneme deneme) {
        this.deneme = deneme;
    }

    public DenemeAnalizSinif deneme(Deneme deneme) {
        this.setDeneme(deneme);
        return this;
    }

    public Sinif getSinif() {
        return this.sinif;
    }

    public void setSinif(Sinif sinif) {
        this.sinif = sinif;
    }

    public DenemeAnalizSinif sinif(Sinif sinif) {
        this.setSinif(sinif);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DenemeAnalizSinif)) {
            return false;
        }
        return id != null && id.equals(((DenemeAnalizSinif) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DenemeAnalizSinif{" +
            "id=" + getId() +
            ", ortalama=" + getOrtalama() +
            ", konuAnalizJson='" + getKonuAnalizJson() + "'" +
            "}";
    }
}
