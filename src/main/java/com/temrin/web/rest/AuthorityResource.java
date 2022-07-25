package com.temrin.web.rest;

import com.temrin.domain.Authority;
import com.temrin.security.AuthoritiesConstants;
import com.temrin.service.AuthorityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AuthorityResource {

    private final Logger log = LoggerFactory.getLogger(AuthorityResource.class);

    private final AuthorityService authorityService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;


    public AuthorityResource(AuthorityService authorityService) {
        this.authorityService = authorityService;
    }

    @PostMapping("/auth")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Authority> createAuth(@Valid @RequestBody Authority authority) throws URISyntaxException {

        Authority a = authorityService.createAuthority(authority);

        return ResponseEntity.ok(a);

    }

    @GetMapping("/auth")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<Authority>> getAllAuth() {
        return ResponseEntity.ok(authorityService.getAllAuth());
    }

    @DeleteMapping("/auth/{auth}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteAuth(@PathVariable String auth) {
        log.debug("REST request to delete User: {}", auth);
        authorityService.deletAuth(auth);
        return ResponseEntity.noContent().headers(HeaderUtil.createAlert(applicationName, "userManagement.deleted", auth)).build();
    }

}
