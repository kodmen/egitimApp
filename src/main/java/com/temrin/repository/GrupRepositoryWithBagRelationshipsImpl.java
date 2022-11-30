package com.temrin.repository;

import com.temrin.domain.Grup;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class GrupRepositoryWithBagRelationshipsImpl implements  GrupRepositoryWithBagRelationships{

    @PersistenceContext
   private EntityManager entityManager;

    @Override
    public Optional<Grup> fetchBagRelationships(Optional<Grup> grup) {
        return grup.map(this::fetchKonular);
    }

    @Override
    public List<Grup> fetchBagRelationships(List<Grup> gruplar) {
        return Optional.of(gruplar).map(this::fetchKonular).orElse(Collections.emptyList());
    }

    @Override
    public Page<Grup> fetchBagRelationships(Page<Grup> gruplar) {
        return new PageImpl<>(fetchBagRelationships(gruplar.getContent()),gruplar.getPageable(),gruplar.getTotalElements());
    }

    Grup fetchKonular(Grup result){
        return entityManager
            .createQuery("select grup from Grup grup left join fetch grup.konular where grup is :grup",Grup.class)
            .setParameter("grup",result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH,false)
            .getSingleResult();
    }

    List<Grup> fetchKonular(List<Grup> gruplar){
        return entityManager
            .createQuery("select  distinct grup from Grup grup left join fetch grup.konular where grup in :gruplar", Grup.class)
            .setParameter("gruplar",gruplar)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH,false)
            .getResultList();
    }
}
