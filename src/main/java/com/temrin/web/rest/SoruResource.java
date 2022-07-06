package com.temrin.web.rest;

import com.temrin.domain.Soru;
import com.temrin.repository.SoruRepository;
import com.temrin.service.SoruService;
import com.temrin.service.dto.SoruDto;
import com.temrin.web.rest.errors.BadRequestAlertException;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
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
//        Soru result = soruRepository.save(soru);
        Soru result = soruService.create(soru);
        return ResponseEntity
            .created(new URI("/api/sorus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
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
     * {@code GET  /sorus} : get all the sorus.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sorus in body.
     */
    @GetMapping("/sorus")
    public List<Soru> getAllSorus(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Sorus");
        return soruRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /sorus/:id} : get the "id" soru.
     *
     * @param id the id of the soru to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the soru, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sorus/{id}")
    public ResponseEntity<Soru> getSoru(@PathVariable Long id) {
        log.debug("REST request to get Soru : {}", id);
        Optional<Soru> soru = soruRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(soru);
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
//        soruRepository.deleteById(id);
        soruService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
