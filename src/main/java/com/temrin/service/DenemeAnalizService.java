package com.temrin.service;

import com.temrin.domain.DenemeAnaliz;
import com.temrin.repository.DenemeAnalizRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class DenemeAnalizService {

    private final DenemeAnalizRepository repository;
    private final UserService userService;

    public DenemeAnalizService(DenemeAnalizRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    public DenemeAnaliz create(DenemeAnaliz denemeAnaliz) {
        return repository.save(denemeAnaliz);
    }

    public List<DenemeAnaliz> getAllDeneme() {
        switch (userService.getAuth()) {
            case "ROLE_ADMIN":
                return repository.findAll();
            case "ROLE_HOCA":
                return repository.findByDeneme_Olusturan(userService.getCurrentUser());
            case "ROLE_USER":
                return repository.findByUserIsCurrentUser();
            default:
                return Collections.emptyList();
        }
    }

    public List<DenemeAnaliz> getHocaDeneme(long denemeId) {
        return repository.findByDeneme_OlusturanAndDeneme_Id(userService.getCurrentUser(), denemeId);
    }
}