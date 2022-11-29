package com.temrin.web.rest;

import com.temrin.domain.Soru;
import com.temrin.repository.SoruRepository;
import com.temrin.service.SoruService;
import com.temrin.service.dto.AdminUserDTO;
import com.temrin.service.dto.SoruDto;
import com.temrin.service.dto.topluSoru.TopluSoru;
import com.temrin.web.rest.errors.BadRequestAlertException;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.temrin.domain.Soru}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SoruResource {

    private final Logger log = LoggerFactory.getLogger(SoruResource.class);

    private static final String ENTITY_NAME = "soru";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SoruRepository soruRepository;
    private final SoruService soruService;

    public SoruResource(SoruRepository soruRepository, SoruService soruService) {
        this.soruRepository = soruRepository;
        this.soruService = soruService;
    }

    @GetMapping("/sorus/konu/{id}")
    public ResponseEntity<List<Soru>> getAllSoruByKonu(@PathVariable Long id) {
        log.debug("REST request to get all Soru for an admin");

        final List<Soru> soruList = soruService.getAllSoruByKonuByGozukme(id);
        return new ResponseEntity<>(soruList, HttpStatus.OK);
    }


    /**
     * {@code POST  /sorus} : Create a new soru.
     *
     * @param soru the soru to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new soru, or with status {@code 400 (Bad Request)} if the soru has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sorus")
    public ResponseEntity<Soru> createSoru(@Valid @RequestBody SoruDto soru) throws URISyntaxException, IOException {
        log.debug("REST request to save Soru : {}", soru);
        if (soru.getId() != null) {
            throw new BadRequestAlertException("A new soru cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Soru result = soruService.create(soru);
        return ResponseEntity
            .created(new URI("/api/sorus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/sorus/toplu-soru")
    public ResponseEntity<List<Soru>> createSoru(@Valid @RequestBody TopluSoru sorular) throws URISyntaxException, IOException {

        List<Soru> result = soruService.topluSoruKaydet(sorular);
        return ResponseEntity
            .created(new URI("/api/sorus/" + String.valueOf(result.size())))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,String.valueOf(result.size())))
            .body(result);
    }

    /**
     * {@code PUT  /sorus/:id} : Updates an existing soru.
     *
     * @param id the id of the soru to save.
     * @param soru the soru to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated soru,
     * or with status {@code 400 (Bad Request)} if the soru is not valid,
     * or with status {@code 500 (Internal Server Error)} if the soru couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sorus/{id}")
    public ResponseEntity<Soru> updateSoru(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Soru soru)
        throws URISyntaxException {
        log.debug("REST request to update Soru : {}, {}", id, soru);
        if (soru.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, soru.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!soruRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Soru result = soruRepository.save(soru);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, soru.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sorus/:id} : Partial updates given fields of an existing soru, field will ignore if it is null
     *
     * @param id the id of the soru to save.
     * @param soru the soru to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated soru,
     * or with status {@code 400 (Bad Request)} if the soru is not valid,
     * or with status {@code 404 (Not Found)} if the soru is not found,
     * or with status {@code 500 (Internal Server Error)} if the soru couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sorus/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Soru> partialUpdateSoru(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Soru soru
    ) throws URISyntaxException {
        log.debug("REST request to partial update Soru partially : {}, {}", id, soru);
        if (soru.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, soru.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!soruRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Soru> result = soruRepository
            .findById(soru.getId())
            .map(existingSoru -> {
                if (soru.getIsim() != null) {
                    existingSoru.setIsim(soru.getIsim());
                }
                if (soru.getCevap() != null) {
                    existingSoru.setCevap(soru.getCevap());
                }
                if (soru.getSira() != null) {
                    existingSoru.setSira(soru.getSira());
                }
                if (soru.getResimUrl() != null) {
                    existingSoru.setResimUrl(soru.getResimUrl());
                }

                return existingSoru;
            })
            .map(soruRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, soru.getId().toString())
        );
    }

    /**
     * {@code GET /admin/users} : get all users with all the details - calling this are only allowed for the administrators.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/sorus")
    public ResponseEntity<List<Soru>> getAllSoru(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get all Soru for an admin");

        final Page<Soru> page = soruService.getAllManagedSoru(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


    @GetMapping("/sorus/konu/gozuksuz/{id}")
    public ResponseEntity<List<Soru>> getAllSoruBykonuandgozuksuz(@PathVariable Long id,@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get all Soru for an admin");

//        final Page<Soru> page = soruService.getKonubySoruByGozukme(id,pageable);
        final Page<Soru> page = soruService.getKonubySoru(id,pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * bütün soruları pageable şeklinde getiriyoruz
     * @param id
     * @return
     */
    @GetMapping("/sorus/{id}")
    public ResponseEntity<Soru> getSoru(@PathVariable Long id) {
        log.debug("REST request to get Soru : {}", id);
        Optional<Soru> soru = soruRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(soru);
    }

    @GetMapping("/sorus/isim/{isim}")
    public ResponseEntity<Soru> getSoruByName(@PathVariable String isim) {
        return ResponseUtil.wrapOrNotFound(soruService.getByName(isim));
    }

    /**
     * {@code DELETE  /sorus/:id} : delete the "id" soru.
     *
     * @param id the id of the soru to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sorus/{id}")
    public ResponseEntity<Void> deleteSoru(@PathVariable Long id) {
        log.debug("REST request to delete Soru : {}", id);
        soruService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
