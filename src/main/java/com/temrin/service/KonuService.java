package com.temrin.service;

import com.temrin.domain.Grup;
import com.temrin.domain.Konu;
import com.temrin.repository.KonuRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KonuService {

    private final KonuRepository repository;
    private final GrupService grupService;

    public KonuService(KonuRepository repository, GrupService grupService) {
        this.repository = repository;
        this.grupService = grupService;
    }

    public Konu getById(Long id) {
        return repository.getById(id);
    }

    public void konuGuncelle(Konu konu){
        repository.save(konu);
    }

    public Konu konuSayisiArttir(Konu k){
        k.setSoruSayisi(k.getSoruSayisi() + 1);
        return repository.save(k);
    }

    public Konu konuSayisiAzalt(Konu k){
        k.setSoruSayisi(k.getSoruSayisi() - 1);
        return repository.save(k);
    }

    public List<Konu> getKonuByGrupId(long grupId){
        Grup grup = grupService.getGrupById(grupId);
        return repository.findAllByGruplar(grup);
    }

    public List<Konu> getAllKonu() {
        return repository.findAll();
    }
}
