package com.temrin.repository;

import com.temrin.domain.Deneme;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface DenemeRepositoryWithBagRelationships {
    Optional<Deneme> fetchBagRelationships(Optional<Deneme> deneme);

    List<Deneme> fetchBagRelationships(List<Deneme> denemes);

    Page<Deneme> fetchBagRelationships(Page<Deneme> denemes);
}
