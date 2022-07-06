package com.temrin.repository;

import com.temrin.domain.Deneme;
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
public class DenemeRepositoryWithBagRelationshipsImpl implements DenemeRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Deneme> fetchBagRelationships(Optional<Deneme> deneme) {
        return deneme.map(this::fetchSorulars);
    }

    @Override
    public Page<Deneme> fetchBagRelationships(Page<Deneme> denemes) {
        return new PageImpl<>(fetchBagRelationships(denemes.getContent()), denemes.getPageable(), denemes.getTotalElements());
    }

    @Override
    public List<Deneme> fetchBagRelationships(List<Deneme> denemes) {
        return Optional.of(denemes).map(this::fetchSorulars).orElse(Collections.emptyList());
    }

    Deneme fetchSorulars(Deneme result) {
        return entityManager
            .createQuery("select deneme from Deneme deneme left join fetch deneme.sorulars where deneme is :deneme", Deneme.class)
            .setParameter("deneme", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Deneme> fetchSorulars(List<Deneme> denemes) {
        return entityManager
            .createQuery("select distinct deneme from Deneme deneme left join fetch deneme.sorulars where deneme in :denemes", Deneme.class)
            .setParameter("denemes", denemes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
