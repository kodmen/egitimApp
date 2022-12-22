package com.temrin.service;


import com.temrin.domain.Sinif;
import com.temrin.domain.User;
import com.temrin.domain.Yurt;
import com.temrin.repository.SinifRepository;
import com.temrin.web.rest.errors.BadRequestAlertException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.temrin.security.AuthoritiesConstants.*;
import static com.temrin.security.SecurityUtils.getCurrentUserLogin;

@Service
public class SinifService {

    public final SinifRepository sinifRepository;
    public final YurtService yurtService;
    public final UserService userService;
    public final EncryptAndDecryptService encryptAndDecryptService;

    public SinifService(SinifRepository sinifRepository, YurtService yurtService, UserService userService, EncryptAndDecryptService encryptAndDecryptService) {
        this.sinifRepository = sinifRepository;
        this.yurtService = yurtService;
        this.userService = userService;
        this.encryptAndDecryptService = encryptAndDecryptService;
    }

    public List<Sinif> getAllSinifForMesul() {
        return sinifRepository.findAllWithEagerRelationships();
//        switch (userService.getAuth()) {
//            case ADMIN:
//                return sinifRepository.findAllWithEagerRelationships();
//            case MESUL:
//                Yurt y = yurtService.getCurrentUserYurt();
//                if (y != null) return sinifRepository.findByYurt(y);
//                return Collections.emptyList();
//            default:
//                return Collections.emptyList();
//        }
    }

    public List<Sinif> getAllSinif() {
        switch (userService.getAuth()) {
            case ADMIN:
                return sinifRepository.findAllWithEagerRelationships();
            case MESUL:
            case HOCA:
//                // BURAYA MESULE AIT
                // EĞER MESUL SE SINIFLARA DİĞER SINIFLARIDA EKLEYEBİLİRİSİN
//                Yurt y = yurtService.getCurrentUserYurt();
//                if (y != null) return sinifRepository.findByYurt(y);
//                return Collections.emptyList();
//            case "ROLE_HOCA":
                List<Sinif> sinifList = sinifRepository.findByHocaIsCurrentUser();
                sinifList.stream().map(sinif -> {
                    sinif.setKonulimizjson(encryptAndDecryptService.encodeToBase64(sinif.getId().toString()));
                    return sinif;
                }).collect(Collectors.toList());
                return sinifList;
            case "ROLE_USER":
                Optional<User> u = userService.getUserLogin(getCurrentUserLogin().get());

                if (u.isPresent()) return sinifRepository.findByOgrencilersIsContaining(u.get());

                return Collections.emptyList();
            default:
                return Collections.emptyList();
        }
    }

    public Sinif getOrgSinif(User user) {
        // burda gelen sınıf ilişkisiz bunu ilişkili yapmak lazım
        List<Sinif> sinifList = sinifRepository.findByOgrencilersIsContaining(user);

        if (sinifList.isEmpty()) {
            return new Sinif();
        }
        return sinifList.get(0);

    }

    public Sinif getSinifByHoca(User hoca) {
        return sinifRepository.findByHoca(hoca);
    }

    public Sinif getCurrentUserSinif() {
        List<Sinif> sinifList = sinifRepository.findByHocaIsCurrentUser();
        return sinifList.size() > 0 ? sinifList.get(0) : null;
    }

    public boolean ogrenciSinifIceriyormu() {
        User current = userService.getCurrentUser();
        return sinifRepository.existsByOgrencilersContains(current);
    }

    public Sinif ogrenciSinifaEkle(String kod) {
        String sinifId;
        Sinif sinif;
        long id;

        try {
            sinifId = encryptAndDecryptService.decodeFromBase64(kod);
            id = Long.parseLong(sinifId);
            sinif = sinifRepository.getById(id);
        } catch (IllegalArgumentException e) {
            throw new BadRequestAlertException("kod çevrilemedi", "sinif", "geçersiz kod");
        } catch (EntityNotFoundException e) {
            sinif = null;
            throw new BadRequestAlertException("girilen kod ile sinif bulunamadı", "sinif", "geçersiz kod");
        } catch (Exception e) {
            throw new BadRequestAlertException("girilen kod yanlis", "sinif", "geçersiz kod");
        }

        User current = userService.getCurrentUser();

        if (sinif != null)
            sinif.getOgrencilers().add(current);

        return sinif;
    }

    public List<Sinif> getSinifByYurt(long y) {
        return sinifRepository.findByYurt_Id(y);
    }

    public List<Sinif> getAllSinifByYurt(Yurt y) {
        return sinifRepository.findByYurt(y);
    }

    // öğrenci sınıftan çıkabilir mi ?

}
