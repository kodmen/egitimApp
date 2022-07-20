package com.temrin.service;

import com.temrin.domain.Deneme;
import com.temrin.domain.DenemeAnalizSinif;
import com.temrin.repository.DenemeAnalizSinifRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class DenemeAnalizSinifService {

    private final DenemeAnalizSinifRepository repository;
    private final UserService userService;

    public DenemeAnalizSinifService(DenemeAnalizSinifRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    public void DenemeAnalizSinifCreate(Deneme d) {
        DenemeAnalizSinif sinif = new DenemeAnalizSinif();
        sinif.setDeneme(d);
        sinif.setOrtalama(0f);

        repository.save(sinif);
    }

    public void updateDenemeAnaliz(DenemeAnalizSinif d) {
        repository.save(d);
    }

    public List<DenemeAnalizSinif> getAllDenemeAnalizSinif() {
        switch (userService.getAuth()) {
            case "ROLE_ADMIN":
                return repository.findAll();
            case "ROLE_HOCA":
                return getHocaDenemeAnalizSinif();
            default:
                return Collections.emptyList();
        }
    }

    public List<DenemeAnalizSinif> getHocaDenemeAnalizSinif() {
        return repository.findByDeneme_Olusturan(userService.getCurrentUser());
    }

    public DenemeAnalizSinif getDeneme(Deneme d) {
        return repository.findByDeneme(d);
    }

    public void denemeAnalizSinifSil(DenemeAnalizSinif denemeAnalizSinif){
        repository.delete(denemeAnalizSinif);
    }
}
