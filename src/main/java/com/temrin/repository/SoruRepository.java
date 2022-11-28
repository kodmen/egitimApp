package com.temrin.repository;

import com.temrin.domain.Konu;
import com.temrin.domain.Soru;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Soru entity.
 */
@Repository
public interface SoruRepository extends JpaRepository<Soru, Long> {
    default Optional<Soru> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Soru> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Soru> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct soru from Soru soru left join fetch soru.konu",
        countQuery = "select count(distinct soru) from Soru soru"
    )
    Page<Soru> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct soru from Soru soru left join fetch soru.konu")
    List<Soru> findAllWithToOneRelationships();

    @Query("select soru from Soru soru left join fetch soru.konu where soru.id =:id")
    Optional<Soru> findOneWithToOneRelationships(@Param("id") Long id);

    List<Soru> findByKonu(Konu konu);
    List<Soru> findByKonuAndGozuksun(Konu konu,boolean b);

    Page<Soru> findByKonuAndGozuksun(Konu konu,boolean b,Pageable pageable);
    Page<Soru> findByKonu(Konu konu,Pageable pageable);
    Optional<Soru> findByIsim(String isim);
}
