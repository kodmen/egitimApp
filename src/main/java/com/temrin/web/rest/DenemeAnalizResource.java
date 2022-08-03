package com.temrin.web.rest;

import com.temrin.domain.DenemeAnaliz;
import com.temrin.repository.DenemeAnalizRepository;
import com.temrin.service.DenemeAnalizService;
import com.temrin.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.temrin.domain.DenemeAnaliz}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DenemeAnalizResource {

    private final Logger log = LoggerFactory.getLogger(DenemeAnalizResource.class);

    private static final String ENTITY_NAME = "denemeAnaliz";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DenemeAnalizRepository denemeAnalizRepository;
    private final DenemeAnalizService denemeAnalizService;

    public DenemeAnalizResource(DenemeAnalizRepository denemeAnalizRepository, DenemeAnalizService denemeAnalizService) {
        this.denemeAnalizRepository = denemeAnalizRepository;
        this.denemeAnalizService = denemeAnalizService;
    }

    /**
     * {@code POST  /deneme-analizs} : Create a new denemeAnaliz.
     *
     * @param denemeAnaliz the denemeAnaliz to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new denemeAnaliz, or with status {@code 400 (Bad Request)} if the denemeAnaliz has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deneme-analizs")
    public ResponseEntity<DenemeAnaliz> createDenemeAnaliz(@Valid @RequestBody DenemeAnaliz denemeAnaliz) throws URISyntaxException {
        log.debug("REST request to save DenemeAnaliz : {}", denemeAnaliz);
        if (denemeAnaliz.getId() != null) {
            throw new BadRequestAlertException("A new denemeAnaliz cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DenemeAnaliz result = denemeAnalizRepository.save(denemeAnaliz);
        return ResponseEntity
            .created(new URI("/api/deneme-analizs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deneme-analizs/:id} : Updates an existing denemeAnaliz.
     *
     * @param id the id of the denemeAnaliz to save.
     * @param denemeAnaliz the denemeAnaliz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated denemeAnaliz,
     * or with status {@code 400 (Bad Request)} if the denemeAnaliz is not valid,
     * or with status {@code 500 (Internal Server Error)} if the denemeAnaliz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deneme-analizs/{id}")
    public ResponseEntity<DenemeAnaliz> updateDenemeAnaliz(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DenemeAnaliz denemeAnaliz
    ) throws URISyntaxException {
        log.debug("REST request to update DenemeAnaliz : {}, {}", id, denemeAnaliz);
        if (denemeAnaliz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, denemeAnaliz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!denemeAnalizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DenemeAnaliz result = denemeAnalizRepository.save(denemeAnaliz);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, denemeAnaliz.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deneme-analizs/:id} : Partial updates given fields of an existing denemeAnaliz, field will ignore if it is null
     *
     * @param id the id of the denemeAnaliz to save.
     * @param denemeAnaliz the denemeAnaliz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated denemeAnaliz,
     * or with status {@code 400 (Bad Request)} if the denemeAnaliz is not valid,
     * or with status {@code 404 (Not Found)} if the denemeAnaliz is not found,
     * or with status {@code 500 (Internal Server Error)} if the denemeAnaliz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deneme-analizs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DenemeAnaliz> partialUpdateDenemeAnaliz(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DenemeAnaliz denemeAnaliz
    ) throws URISyntaxException {
        log.debug("REST request to partial update DenemeAnaliz partially : {}, {}", id, denemeAnaliz);
        if (denemeAnaliz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, denemeAnaliz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!denemeAnalizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DenemeAnaliz> result = denemeAnalizRepository
            .findById(denemeAnaliz.getId())
            .map(existingDenemeAnaliz -> {
                if (denemeAnaliz.getDogru() != null) {
                    existingDenemeAnaliz.setDogru(denemeAnaliz.getDogru());
                }
                if (denemeAnaliz.getYanlis() != null) {
                    existingDenemeAnaliz.setYanlis(denemeAnaliz.getYanlis());
                }
                if (denemeAnaliz.getPuan() != null) {
                    existingDenemeAnaliz.setPuan(denemeAnaliz.getPuan());
                }
                if (denemeAnaliz.getCozuldu() != null) {
                    existingDenemeAnaliz.setCozuldu(denemeAnaliz.getCozuldu());
                }
                if (denemeAnaliz.getKonuAnalizJson() != null) {
                    existingDenemeAnaliz.setKonuAnalizJson(denemeAnaliz.getKonuAnalizJson());
                }
                if (denemeAnaliz.getSure() != null) {
                    existingDenemeAnaliz.setSure(denemeAnaliz.getSure());
                }

                return existingDenemeAnaliz;
            })
            .map(denemeAnalizRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, denemeAnaliz.getId().toString())
        );
    }

    /**
     * {@code GET  /deneme-analizs} : get all the denemeAnalizs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of denemeAnalizs in body.
     */
    @GetMapping("/deneme-analizs")
    public List<DenemeAnaliz> getAllDenemeAnalizs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all DenemeAnalizs");
//        return denemeAnalizRepository.findAllWithEagerRelationships();
        return denemeAnalizService.getAllDeneme();
    }

    /**
     * {@code GET  /deneme-analizs/:id} : get the "id" denemeAnaliz.
     *
     * @param id the id of the denemeAnaliz to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the denemeAnaliz, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deneme-analizs/hoca/{id}")
    public List<DenemeAnaliz> getDenemeAnalizHoca(@PathVariable Long id) {
        log.debug("REST request to get DenemeAnaliz : {}", id);
        List<DenemeAnaliz> denemeAnaliz = denemeAnalizService.getHocaDeneme(id);
        return denemeAnaliz;
    }

    /**
     * {@code GET  /deneme-analizs/:id} : get the "id" denemeAnaliz.
     *
     * @param id the id of the denemeAnaliz to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the denemeAnaliz, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deneme-analizs/{id}")
    public ResponseEntity<DenemeAnaliz> getDenemeAnaliz(@PathVariable Long id) {
        log.debug("REST request to get DenemeAnaliz : {}", id);
        Optional<DenemeAnaliz> denemeAnaliz = denemeAnalizRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(denemeAnaliz);
    }

    /**
     * {@code DELETE  /deneme-analizs/:id} : delete the "id" denemeAnaliz.
     *
     * @param id the id of the denemeAnaliz to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deneme-analizs/{id}")
    public ResponseEntity<Void> deleteDenemeAnaliz(@PathVariable Long id) {
        log.debug("REST request to delete DenemeAnaliz : {}", id);
        denemeAnalizRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
