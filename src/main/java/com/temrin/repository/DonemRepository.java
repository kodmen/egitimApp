package com.temrin.repository;

import com.temrin.domain.Donem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Donem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DonemRepository extends JpaRepository<Donem, Long> {}
