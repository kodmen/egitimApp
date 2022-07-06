package com.temrin.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Yurt.
 */
@Entity
@Table(name = "yurt")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Yurt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 500)
    @Column(name = "isim", length = 500)
    private String isim;

    @ManyToOne
    private User mesul;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Yurt id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsim() {
        return this.isim;
    }

    public Yurt isim(String isim) {
        this.setIsim(isim);
        return this;
    }

    public void setIsim(String isim) {
        this.isim = isim;
    }

    public User getMesul() {
        return this.mesul;
    }

    public void setMesul(User user) {
        this.mesul = user;
    }

    public Yurt mesul(User user) {
        this.setMesul(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Yurt)) {
            return false;
        }
        return id != null && id.equals(((Yurt) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Yurt{" +
            "id=" + getId() +
            ", isim='" + getIsim() + "'" +
            "}";
    }
}
