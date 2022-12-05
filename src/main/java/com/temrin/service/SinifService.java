package com.temrin.service;


import com.temrin.domain.Sinif;
import com.temrin.domain.User;
import com.temrin.domain.Yurt;
import com.temrin.repository.SinifRepository;
import com.temrin.web.rest.errors.BadRequestAlertException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<Sinif> getAllSinif() {
        switch (userService.getAuth()) {
            case "ROLE_ADMIN":
                return sinifRepository.findAllWithEagerRelationships();
            case "ROLE_MESUL":
                Yurt y = yurtService.getCurrentUserYurt();
                if (y != null) return sinifRepository.findByYurt(y);
                return Collections.emptyList();
            case "ROLE_HOCA":
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

        if (sinifList.isEmpty()){
            return new Sinif();
        }
        return sinifList.get(0);

    }

    public Sinif getSinifByHoca(User hoca){
        return sinifRepository.findByHoca(hoca);
    }

    public Sinif getCurrentUserSinif(){
        List<Sinif> sinifList = sinifRepository.findByHocaIsCurrentUser();
        return sinifList.size() > 0 ? sinifList.get(0) : null;
    }

    public boolean ogrenciSinifIceriyormu(){
        User current = userService.getCurrentUser();
//        Optional<User> u = userService.findByLogin(login);
        return sinifRepository.existsByOgrencilersContains(current);
    }

    public Sinif ogrenciSinifaEkle(String kod){
        String sinifId;
        try{
             sinifId = encryptAndDecryptService.decodeFromBase64(kod);
        }catch (IllegalArgumentException e){
            throw new BadRequestAlertException("Entity not found", "sinif", "geçersiz id");
        }


        User current = userService.getCurrentUser();
        Sinif sinif = sinifRepository.getById(Long.parseLong(sinifId));
        sinif.getOgrencilers().add(current);
        return sinif;
    }

    public List<Sinif> getSinifByYurt(long y){
        return sinifRepository.findByYurt_Id(y);
    }

    public List<Sinif> getAllSinifByYurt(Yurt y){
        return sinifRepository.findByYurt(y);
    }

    // öğrenci sınıftan çıkabilir mi ?

}
