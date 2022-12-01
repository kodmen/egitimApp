package com.temrin.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Grup.
 */
@Entity
@Table(name = "grup")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Grup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 500)
    @Column(name = "isim", length = 500)
    private String isim;

    @ManyToMany
    @JoinTable(
        name = "rel_gurup__konular",
        joinColumns = @JoinColumn(name = "gurup_id"),
        inverseJoinColumns = @JoinColumn(name = "konular_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Konu> konular = new HashSet<>();

    @Column(name = "gozuksun", columnDefinition = "boolean default true")
    private Boolean gozuksun;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Boolean getGozuksun() {
        return gozuksun;
    }

    public void setGozuksun(Boolean gozuksun) {
        this.gozuksun = gozuksun;
    }

    public Set<Konu> getKonular() {
        return konular;
    }

    public void setKonular(Set<Konu> konular) {
        this.konular = konular;
    }

    public Grup konular(Set<Konu> konular){
        this.setKonular(konular);
        return this;
    }
    public Grup addKonular(Konu konu){
        this.konular.add(konu);
        return this;
    }

    public Grup removeKonular(Konu konu){
        this.konular.remove(konu);
        return this;
    }

    public Long getId() {
        return this.id;
    }

    public Grup id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsim() {
        return this.isim;
    }

    public Grup isim(String isim) {
        this.setIsim(isim);
        return this;
    }

    public void setIsim(String isim) {
        this.isim = isim;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Grup)) {
            return false;
        }
        return id != null && id.equals(((Grup) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Grup{" +
            "id=" + getId() +
            ", isim='" + getIsim() + "'" +
            "}";
    }
}
