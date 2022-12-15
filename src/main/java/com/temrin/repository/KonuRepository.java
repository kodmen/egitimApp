package com.temrin.repository;

import com.temrin.domain.Grup;
import com.temrin.domain.Konu;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data SQL repository for the Konu entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KonuRepository extends JpaRepository<Konu, Long> {
    List<Konu> findAllByGruplar(Grup grup);

    Optional<Konu> findKonuByIsim(String isim);

//    Optional<List<Konu>> findAllByIsimContains(String isim);
//
//    List<Konu> findByIsimIsContaining(String isim);
//    List<Konu> findByIsimLike(String isim);


}
