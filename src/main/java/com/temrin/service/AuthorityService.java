package com.temrin.service;

import com.temrin.domain.Authority;
import com.temrin.repository.AuthorityRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthorityService {

    // buraya aut getir
    private final AuthorityRepository repository;

    public AuthorityService(AuthorityRepository repository) {
        this.repository = repository;
    }

    public Authority getAuthorityByName(String name) {
        return repository.findByName(name);
    }
}
