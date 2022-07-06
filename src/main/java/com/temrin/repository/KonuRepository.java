package com.temrin.repository;

import com.temrin.domain.Konu;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Konu entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KonuRepository extends JpaRepository<Konu, Long> {}
