package com.temrin.service;


import com.temrin.domain.Sinif;
import com.temrin.domain.User;
import com.temrin.domain.Yurt;
import com.temrin.repository.SinifRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.temrin.security.SecurityUtils.getCurrentUserLogin;

@Service
public class SinifService {

    public final SinifRepository sinifRepository;
    public final YurtService yurtService;
    public final UserService userService;

    public SinifService(SinifRepository sinifRepository, YurtService yurtService, UserService userService) {
        this.sinifRepository = sinifRepository;
        this.yurtService = yurtService;
        this.userService = userService;
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
                return sinifRepository.findByHocaIsCurrentUser();
            case "ROLE_USER":
                Optional<User> u = userService.getUserLogin(getCurrentUserLogin().get());

                if (u.isPresent()) return sinifRepository.findByOgrencilersIsContaining(u.get());

                return Collections.emptyList();
            default:
                return Collections.emptyList();
        }
    }

    public Sinif getOrgSinif(User user) {
        List<Sinif> sinifList = sinifRepository.findByOgrencilersIsContaining(user);
        if (sinifList.size() > 2) return sinifList.get(0);

        if (sinifList.size() >= 1) return sinifList.get(0);

        return new Sinif();
    }
}