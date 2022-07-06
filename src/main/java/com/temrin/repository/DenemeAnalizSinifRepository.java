package com.temrin.repository;

import com.temrin.domain.Deneme;
import com.temrin.domain.DenemeAnalizSinif;
import java.util.List;
import java.util.Optional;

import com.temrin.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DenemeAnalizSinif entity.
 */
@Repository
public interface DenemeAnalizSinifRepository extends JpaRepository<DenemeAnalizSinif, Long> {
    default Optional<DenemeAnalizSinif> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<DenemeAnalizSinif> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<DenemeAnalizSinif> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct denemeAnalizSinif from DenemeAnalizSinif denemeAnalizSinif left join fetch denemeAnalizSinif.deneme left join fetch denemeAnalizSinif.sinif",
        countQuery = "select count(distinct denemeAnalizSinif) from DenemeAnalizSinif denemeAnalizSinif"
    )
    Page<DenemeAnalizSinif> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct denemeAnalizSinif from DenemeAnalizSinif denemeAnalizSinif left join fetch denemeAnalizSinif.deneme left join fetch denemeAnalizSinif.sinif"
    )
    List<DenemeAnalizSinif> findAllWithToOneRelationships();

    @Query(
        "select denemeAnalizSinif from DenemeAnalizSinif denemeAnalizSinif left join fetch denemeAnalizSinif.deneme left join fetch denemeAnalizSinif.sinif where denemeAnalizSinif.id =:id"
    )
    Optional<DenemeAnalizSinif> findOneWithToOneRelationships(@Param("id") Long id);

    DenemeAnalizSinif findByDeneme(Deneme deneme);

    List<DenemeAnalizSinif> findByDeneme_Olusturan(User user);

}
