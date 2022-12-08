package com.temrin.repository;

import com.temrin.domain.Mesaj;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Mesaj entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MesajRepository extends JpaRepository<Mesaj, Long> {}
