package com.temrin.repository;

import com.temrin.domain.Deneme;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.temrin.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Deneme entity.
 */
@Repository
public interface DenemeRepository extends DenemeRepositoryWithBagRelationships, JpaRepository<Deneme, Long> {
    @Query("select deneme from Deneme deneme where deneme.olusturan.login = ?#{principal.username}")
    List<Deneme> findByOlusturanIsCurrentUser();

    default Optional<Deneme> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Deneme> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Deneme> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct deneme from Deneme deneme left join fetch deneme.olusturan",
        countQuery = "select count(distinct deneme) from Deneme deneme"
    )
    Page<Deneme> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct deneme from Deneme deneme left join fetch deneme.olusturan")
    List<Deneme> findAllWithToOneRelationships();

    @Query("select deneme from Deneme deneme left join fetch deneme.olusturan where deneme.id =:id")
    Optional<Deneme> findOneWithToOneRelationships(@Param("id") Long id);

    List<Deneme> findAllByOlusturmaTarihLessThanEqualAndBaslamaTarihGreaterThanEqual(LocalDate d, Instant t);

    List<Deneme> findAllByBaslamaTarihBetween(Instant a, Instant b);

    List<Deneme> findAllByBaslamaTarihBetweenAndOlusturan(Instant a, Instant b, User olusturan);
}
