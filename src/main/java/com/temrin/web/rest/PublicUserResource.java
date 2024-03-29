package com.temrin.web.rest;

import com.temrin.domain.Authority;
import com.temrin.service.AuthorityService;
import com.temrin.service.UserService;
import com.temrin.service.dto.UserDTO;
import java.util.*;
import java.util.Collections;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequestMapping("/api")
public class PublicUserResource {

    private static final List<String> ALLOWED_ORDERED_PROPERTIES = Collections.unmodifiableList(
        Arrays.asList("id", "login", "firstName", "lastName", "email", "activated", "langKey")
    );

    private final Logger log = LoggerFactory.getLogger(PublicUserResource.class);

    private final UserService userService;
    private final AuthorityService authorityService;

    public PublicUserResource(UserService userService, AuthorityService authorityService) {
        this.userService = userService;
        this.authorityService = authorityService;
    }

    /**
     * {@code GET /users} : get all users with only the public informations - calling this are allowed for anyone.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllPublicUsers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get all public User names");
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }

        final Page<UserDTO> page = userService.getAllPublicUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    private boolean onlyContainsAllowedProperties(Pageable pageable) {
        return pageable.getSort().stream().map(Sort.Order::getProperty).allMatch(ALLOWED_ORDERED_PROPERTIES::contains);
    }

    @GetMapping("/users/hoca")
    public ResponseEntity<List<UserDTO>> getAllPublicUsersHoca() {
        final List<UserDTO> page = userService.getAllHoca();
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping("/users/mesul")
    public ResponseEntity<List<UserDTO>> getAllPublicUsersMesul() {
        final List<UserDTO> page = userService.getAllMesul();
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping("/users/ogrenci")
    public ResponseEntity<List<UserDTO>> getAllPublicUsersOgrenci(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get all public User names");
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }
        // burda ogrenciler hepsi birden gelmesi sistemi yorar
        final List<UserDTO> page = userService.getAllOgrenci(pageable);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }


    /**
     * Gets a list of all roles.
     * @return a string list of all roles.
     */
    @GetMapping("/authorities")
    public List<String> getAuthorities() {

//        return userService.getAuthorities();
        return authorityService.getAllAuth().stream().map(Authority::getName).collect(Collectors.toList());
    }
}
