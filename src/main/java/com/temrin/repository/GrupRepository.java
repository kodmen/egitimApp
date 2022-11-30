package com.temrin.repository;

import com.temrin.domain.Grup;
import com.temrin.domain.Sinif;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Grup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrupRepository extends GrupRepositoryWithBagRelationships, JpaRepository<Grup, Long> {

    default List<Grup> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

}
