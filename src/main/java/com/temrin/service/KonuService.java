package com.temrin.service;

import com.temrin.domain.Konu;
import com.temrin.repository.KonuRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KonuService {

    private final KonuRepository repository;

    public KonuService(KonuRepository repository) {
        this.repository = repository;
    }

    public Konu getById(Long id) {
        return repository.getById(id);
    }

    public List<Konu> getAllKonu() {
        return repository.findAll();
    }
}