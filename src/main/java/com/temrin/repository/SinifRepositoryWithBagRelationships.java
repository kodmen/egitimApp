package com.temrin.repository;

import com.temrin.domain.Sinif;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface SinifRepositoryWithBagRelationships {
    Optional<Sinif> fetchBagRelationships(Optional<Sinif> sinif);

    List<Sinif> fetchBagRelationships(List<Sinif> sinifs);

    Page<Sinif> fetchBagRelationships(Page<Sinif> sinifs);
}
