package com.temrin.repository;

import com.temrin.domain.Grup;
import com.temrin.domain.Sinif;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface GrupRepositoryWithBagRelationships {
    Optional<Grup> fetchBagRelationships(Optional<Grup> grup);

    List<Grup> fetchBagRelationships(List<Grup> grup);

    Page<Grup> fetchBagRelationships(Page<Grup> grup);
}
