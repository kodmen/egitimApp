package com.temrin.service;

import com.temrin.domain.Authority;
import com.temrin.domain.Sinif;
import com.temrin.domain.User;
import com.temrin.domain.Yurt;
import com.temrin.repository.AuthorityRepository;
import com.temrin.security.AuthoritiesConstants;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.temrin.security.SecurityUtils.getCurrentUserLogin;

@Service
public class AuthorityService {

    // buraya aut getir
    private final AuthorityRepository repository;
    private final UserService userService;

    public AuthorityService(AuthorityRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    public Authority getAuthorityByName(String name) {
        return repository.findByName(name);
    }

    public Authority createAuthority(Authority a){
        return repository.save(a);
    }

    public List<Authority>  getAllAuth(){

        switch (userService.getAuth()) {
            case "ROLE_ADMIN":
                return repository.findAll();
            case "ROLE_MESUL":
                Authority hoca = repository.findByName(AuthoritiesConstants.HOCA);
                Authority user = repository.findByName(AuthoritiesConstants.USER);
                return Arrays.asList(hoca,user);
           default:
                return Collections.emptyList();
        }
        // burda mesul olarak yapılabilir


    }

    public void deletAuth(String a){

        repository.delete(repository.findByName(a));
    }
}
