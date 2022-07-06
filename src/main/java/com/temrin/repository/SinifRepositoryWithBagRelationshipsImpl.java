package com.temrin.repository;

import com.temrin.domain.Sinif;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class SinifRepositoryWithBagRelationshipsImpl implements SinifRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Sinif> fetchBagRelationships(Optional<Sinif> sinif) {
        return sinif.map(this::fetchOgrencilers);
    }

    @Override
    public Page<Sinif> fetchBagRelationships(Page<Sinif> sinifs) {
        return new PageImpl<>(fetchBagRelationships(sinifs.getContent()), sinifs.getPageable(), sinifs.getTotalElements());
    }

    @Override
    public List<Sinif> fetchBagRelationships(List<Sinif> sinifs) {
        return Optional.of(sinifs).map(this::fetchOgrencilers).orElse(Collections.emptyList());
    }

    Sinif fetchOgrencilers(Sinif result) {
        return entityManager
            .createQuery("select sinif from Sinif sinif left join fetch sinif.ogrencilers where sinif is :sinif", Sinif.class)
            .setParameter("sinif", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Sinif> fetchOgrencilers(List<Sinif> sinifs) {
        return entityManager
            .createQuery("select distinct sinif from Sinif sinif left join fetch sinif.ogrencilers where sinif in :sinifs", Sinif.class)
            .setParameter("sinifs", sinifs)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
