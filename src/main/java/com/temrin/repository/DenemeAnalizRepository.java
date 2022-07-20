package com.temrin.repository;

import com.temrin.domain.Deneme;
import com.temrin.domain.DenemeAnaliz;
import java.util.List;
import java.util.Optional;

import com.temrin.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DenemeAnaliz entity.
 */
@Repository
public interface DenemeAnalizRepository extends JpaRepository<DenemeAnaliz, Long> {
    @Query("select denemeAnaliz from DenemeAnaliz denemeAnaliz where denemeAnaliz.user.login = ?#{principal.username}")
    List<DenemeAnaliz> findByUserIsCurrentUser();

    default Optional<DenemeAnaliz> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<DenemeAnaliz> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<DenemeAnaliz> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct denemeAnaliz from DenemeAnaliz denemeAnaliz left join fetch denemeAnaliz.user left join fetch denemeAnaliz.deneme",
        countQuery = "select count(distinct denemeAnaliz) from DenemeAnaliz denemeAnaliz"
    )
    Page<DenemeAnaliz> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct denemeAnaliz from DenemeAnaliz denemeAnaliz left join fetch denemeAnaliz.user left join fetch denemeAnaliz.deneme"
    )
    List<DenemeAnaliz> findAllWithToOneRelationships();

    @Query(
        "select denemeAnaliz from DenemeAnaliz denemeAnaliz left join fetch denemeAnaliz.user left join fetch denemeAnaliz.deneme where denemeAnaliz.id =:id"
    )
    Optional<DenemeAnaliz> findOneWithToOneRelationships(@Param("id") Long id);

    List<DenemeAnaliz> findByDeneme_Olusturan(User user);

    List<DenemeAnaliz> findByDeneme_OlusturanAndDeneme_Id(User user, long denemeId);

    boolean existsByDeneme_IdAndUser(long id,User u);

    List<DenemeAnaliz> findByDeneme(Deneme deneme);
}
