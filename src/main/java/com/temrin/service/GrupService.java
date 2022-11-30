package com.temrin.service;

import com.temrin.domain.Donem;
import com.temrin.domain.Grup;
import com.temrin.repository.GrupRepository;
import org.springframework.stereotype.Service;

@Service
public class GrupService {

    private final GrupRepository repository;

    public GrupService(GrupRepository repository) {
        this.repository = repository;
    }

    public Grup crate(Grup grup){
        return repository.save(grup);
    }

    public Grup getGrupById(long id){
        return repository.getById(id);
    }
}
