package com.temrin.service;

import com.temrin.domain.Authority;
import com.temrin.repository.AuthorityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorityService {

    // buraya aut getir
    private final AuthorityRepository repository;

    public AuthorityService(AuthorityRepository repository) {
        this.repository = repository;
    }

    public Authority getAuthorityByName(String name) {
        return repository.findByName(name);
    }

    public Authority createAuthority(Authority a){
        return repository.save(a);
    }

    public List<Authority>  getAllAuth(){
        return repository.findAll();
    }

    public void deletAuth(String a){

        repository.delete(repository.findByName(a));
    }
}
