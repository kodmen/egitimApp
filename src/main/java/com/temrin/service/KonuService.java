package com.temrin.service;

import com.temrin.domain.Grup;
import com.temrin.domain.Konu;
import com.temrin.domain.Sinif;
import com.temrin.repository.KonuRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.temrin.security.AuthoritiesConstants.*;

@Service
public class KonuService {

    private final KonuRepository repository;
    private final GrupService grupService;
    private final UserService userService;
    private final SinifService sinifService;

    public KonuService(KonuRepository repository, GrupService grupService, UserService userService, SinifService sinifService) {
        this.repository = repository;
        this.grupService = grupService;
        this.userService = userService;
        this.sinifService = sinifService;
    }

    public Konu getById(Long id) {
        return repository.getById(id);
    }

    public void konuGuncelle(Konu konu){
        repository.save(konu);
    }


    public List<Konu> getAll(){

        // farklı roller geldiği zaman buraya ekleme yapılabilir mesela editor gibi
        switch (userService.getAuth()){
            case HOCA:
            case MESUL:
                // bir hocanın birden fazla sınıfı olursa burası patlıyor
                // burda eğer hocanın birden çok sınıfı varsa buraya değilde sınıf id si ile konuları getir
                Sinif sinif = sinifService.getSinifByHoca(userService.getCurrentUser());
                return repository.findAllByGruplar(sinif.getGrup());
            case ADMIN:
            case EDITOR:
                return repository.findAll();
            default:
                return Collections.emptyList();
        }

    }

    public List<Konu> getByGrup(String grup){
        Optional<Grup> g = grupService.getGrupByIsim(grup);
        if (g.isPresent()){
            return repository.findAllByGruplar(g.get());
        }else {
            return Collections.emptyList();
        }
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

}
