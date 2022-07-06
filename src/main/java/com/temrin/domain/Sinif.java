package com.temrin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Sinif.
 */
@Entity
@Table(name = "sinif")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Sinif implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    /**
     * isim
     */
    @Schema(description = "isim")
    @Size(max = 500)
    @Column(name = "isim", length = 500)
    private String isim;

    @Size(max = 5000)
    @Column(name = "konulimizjson", length = 5000)
    private String konulimizjson;

    @ManyToOne
    @JsonIgnoreProperties(value = { "mesul" }, allowSetters = true)
    private Yurt yurt;

    @ManyToOne
    private Grup grup;

    @ManyToOne
    private User hoca;

    @ManyToMany
    @JoinTable(
        name = "rel_sinif__ogrenciler",
        joinColumns = @JoinColumn(name = "sinif_id"),
        inverseJoinColumns = @JoinColumn(name = "ogrenciler_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> ogrencilers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sinif id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsim() {
        return this.isim;
    }

    public Sinif isim(String isim) {
        this.setIsim(isim);
        return this;
    }

    public void setIsim(String isim) {
        this.isim = isim;
    }

    public String getKonulimizjson() {
        return this.konulimizjson;
    }

    public Sinif konulimizjson(String konulimizjson) {
        this.setKonulimizjson(konulimizjson);
        return this;
    }

    public void setKonulimizjson(String konulimizjson) {
        this.konulimizjson = konulimizjson;
    }

    public Yurt getYurt() {
        return this.yurt;
    }

    public void setYurt(Yurt yurt) {
        this.yurt = yurt;
    }

    public Sinif yurt(Yurt yurt) {
        this.setYurt(yurt);
        return this;
    }

    public Grup getGrup() {
        return this.grup;
    }

    public void setGrup(Grup grup) {
        this.grup = grup;
    }

    public Sinif grup(Grup grup) {
        this.setGrup(grup);
        return this;
    }

    public User getHoca() {
        return this.hoca;
    }

    public void setHoca(User user) {
        this.hoca = user;
    }

    public Sinif hoca(User user) {
        this.setHoca(user);
        return this;
    }

    public Set<User> getOgrencilers() {
        return this.ogrencilers;
    }

    public void setOgrencilers(Set<User> users) {
        this.ogrencilers = users;
    }

    public Sinif ogrencilers(Set<User> users) {
        this.setOgrencilers(users);
        return this;
    }

    public Sinif addOgrenciler(User user) {
        this.ogrencilers.add(user);
        return this;
    }

    public Sinif removeOgrenciler(User user) {
        this.ogrencilers.remove(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sinif)) {
            return false;
        }
        return id != null && id.equals(((Sinif) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sinif{" +
            "id=" + getId() +
            ", isim='" + getIsim() + "'" +
            ", konulimizjson='" + getKonulimizjson() + "'" +
            "}";
    }
}
