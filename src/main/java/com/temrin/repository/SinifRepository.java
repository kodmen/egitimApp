package com.temrin.repository;

import com.temrin.domain.Sinif;
import java.util.List;
import java.util.Optional;

import com.temrin.domain.User;
import com.temrin.domain.Yurt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Sinif entity.
 */
@Repository
public interface SinifRepository extends SinifRepositoryWithBagRelationships, JpaRepository<Sinif, Long> {
    @Query("select sinif from Sinif sinif where sinif.hoca.login = ?#{principal.username}")
    List<Sinif> findByHocaIsCurrentUser();

    default Optional<Sinif> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Sinif> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Sinif> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct sinif from Sinif sinif left join fetch sinif.yurt left join fetch sinif.grup left join fetch sinif.hoca",
        countQuery = "select count(distinct sinif) from Sinif sinif"
    )
    Page<Sinif> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct sinif from Sinif sinif left join fetch sinif.yurt left join fetch sinif.grup left join fetch sinif.hoca")
    List<Sinif> findAllWithToOneRelationships();

    @Query(
        "select sinif from Sinif sinif left join fetch sinif.yurt left join fetch sinif.grup left join fetch sinif.hoca where sinif.id =:id"
    )
    Optional<Sinif> findOneWithToOneRelationships(@Param("id") Long id);

    List<Sinif> findByYurt(Yurt yurt);

    List<Sinif> findByYurt_Id(long id);

    Sinif findByHoca(User hoca);

    List<Sinif> findByOgrencilersIsContaining(User user);

    // öğrenciyi içeriyor mu
    boolean existsByOgrencilersContains(User u);

    List<Sinif> findAllByYurt(Yurt y);
}
