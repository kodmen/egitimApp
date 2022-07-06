package com.temrin.service;

import com.temrin.repository.GrupRepository;
import org.springframework.stereotype.Service;

@Service
public class GrupService {

    private final GrupRepository repository;

    public GrupService(GrupRepository repository) {
        this.repository = repository;
    }
}
