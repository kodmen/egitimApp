package com.temrin.repository;

import com.temrin.domain.Grup;
import com.temrin.domain.Sinif;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data SQL repository for the Grup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrupRepository extends GrupRepositoryWithBagRelationships, JpaRepository<Grup, Long> {

    default List<Grup> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Optional<Grup> findByIdWithEagerRelationships(long id){
        return fetchBagRelationships(this.findById(id));
    }

    List<Grup> findAllByGozuksun(boolean gozuksun);
}
