package com.temrin.repository;

import com.temrin.domain.Yurt;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Yurt entity.
 */
@Repository
public interface YurtRepository extends JpaRepository<Yurt, Long> {
    @Query("select yurt from Yurt yurt where yurt.mesul.login = ?#{principal.username}")
    List<Yurt> findByMesulIsCurrentUser();

    default Optional<Yurt> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Yurt> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Yurt> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct yurt from Yurt yurt left join fetch yurt.mesul",
        countQuery = "select count(distinct yurt) from Yurt yurt"
    )
    Page<Yurt> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct yurt from Yurt yurt left join fetch yurt.mesul")
    List<Yurt> findAllWithToOneRelationships();

    @Query("select yurt from Yurt yurt left join fetch yurt.mesul where yurt.id =:id")
    Optional<Yurt> findOneWithToOneRelationships(@Param("id") Long id);
}
