package com.temrin.repository;

import com.temrin.domain.Grup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Grup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrupRepository extends JpaRepository<Grup, Long> {}
