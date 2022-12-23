package com.temrin.service;

import com.temrin.domain.Deneme;
import com.temrin.domain.DenemeAnalizSinif;
import com.temrin.domain.Sinif;
import com.temrin.repository.DenemeAnalizSinifRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import static com.temrin.security.AuthoritiesConstants.MESUL;

@Service
public class DenemeAnalizSinifService {

    private final DenemeAnalizSinifRepository repository;
    private final UserService userService;
    private final SinifService sinifService;

    public DenemeAnalizSinifService(DenemeAnalizSinifRepository repository, UserService userService, SinifService sinifService) {
        this.repository = repository;
        this.userService = userService;
        this.sinifService = sinifService;
    }

    public void DenemeAnalizSinifCreate(Deneme d) {
        // buraya deneme old sınıfı koymak lazım
        DenemeAnalizSinif sinif = new DenemeAnalizSinif();
        Sinif hocaSinif = d.getSinif();
        sinif.setSinif(hocaSinif);
        sinif.setDeneme(d);
        sinif.setOrtalama(0f);

        repository.save(sinif);
    }

    public void updateDenemeAnaliz(DenemeAnalizSinif d) {
        repository.save(d);
    }

    public List<DenemeAnalizSinif> getAllDenemeAnalizSinif(long sinifId) {
        switch (userService.getAuth()) {
            case "ROLE_ADMIN":
                return repository.findAll();
            case "ROLE_HOCA":
            case MESUL:
                return getHocaDenemeAnalizSinif(sinifId);
            default:
                return Collections.emptyList();
        }
    }

    public List<DenemeAnalizSinif> getHocaDenemeAnalizSinif(long id) {
        // hocaya ait olan sinifları getir
        // sinif id e göre deneme analizlerini getir
        // gelen denemeanalizlerini hocaya göster
        //return repository.findByDeneme_Olusturan(userService.getCurrentUser());
        return repository.findBySinif_Id(id);
    }

    public DenemeAnalizSinif getDeneme(Deneme d) {
        return repository.findByDeneme(d);
    }

    public void denemeAnalizSinifSil(DenemeAnalizSinif denemeAnalizSinif){
        repository.delete(denemeAnalizSinif);
    }
}
