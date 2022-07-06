package com.temrin.web.rest;

import com.temrin.domain.DenemeAnalizSinif;
import com.temrin.repository.DenemeAnalizSinifRepository;
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
 * REST controller for managing {@link com.temrin.domain.DenemeAnalizSinif}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DenemeAnalizSinifResource {

    private final Logger log = LoggerFactory.getLogger(DenemeAnalizSinifResource.class);

    private static final String ENTITY_NAME = "denemeAnalizSinif";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DenemeAnalizSinifRepository denemeAnalizSinifRepository;

    public DenemeAnalizSinifResource(DenemeAnalizSinifRepository denemeAnalizSinifRepository) {
        this.denemeAnalizSinifRepository = denemeAnalizSinifRepository;
    }

    /**
     * {@code POST  /deneme-analiz-sinifs} : Create a new denemeAnalizSinif.
     *
     * @param denemeAnalizSinif the denemeAnalizSinif to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new denemeAnalizSinif, or with status {@code 400 (Bad Request)} if the denemeAnalizSinif has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deneme-analiz-sinifs")
    public ResponseEntity<DenemeAnalizSinif> createDenemeAnalizSinif(@Valid @RequestBody DenemeAnalizSinif denemeAnalizSinif)
        throws URISyntaxException {
        log.debug("REST request to save DenemeAnalizSinif : {}", denemeAnalizSinif);
        if (denemeAnalizSinif.getId() != null) {
            throw new BadRequestAlertException("A new denemeAnalizSinif cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DenemeAnalizSinif result = denemeAnalizSinifRepository.save(denemeAnalizSinif);
        return ResponseEntity
            .created(new URI("/api/deneme-analiz-sinifs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deneme-analiz-sinifs/:id} : Updates an existing denemeAnalizSinif.
     *
     * @param id the id of the denemeAnalizSinif to save.
     * @param denemeAnalizSinif the denemeAnalizSinif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated denemeAnalizSinif,
     * or with status {@code 400 (Bad Request)} if the denemeAnalizSinif is not valid,
     * or with status {@code 500 (Internal Server Error)} if the denemeAnalizSinif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deneme-analiz-sinifs/{id}")
    public ResponseEntity<DenemeAnalizSinif> updateDenemeAnalizSinif(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DenemeAnalizSinif denemeAnalizSinif
    ) throws URISyntaxException {
        log.debug("REST request to update DenemeAnalizSinif : {}, {}", id, denemeAnalizSinif);
        if (denemeAnalizSinif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, denemeAnalizSinif.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!denemeAnalizSinifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DenemeAnalizSinif result = denemeAnalizSinifRepository.save(denemeAnalizSinif);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, denemeAnalizSinif.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deneme-analiz-sinifs/:id} : Partial updates given fields of an existing denemeAnalizSinif, field will ignore if it is null
     *
     * @param id the id of the denemeAnalizSinif to save.
     * @param denemeAnalizSinif the denemeAnalizSinif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated denemeAnalizSinif,
     * or with status {@code 400 (Bad Request)} if the denemeAnalizSinif is not valid,
     * or with status {@code 404 (Not Found)} if the denemeAnalizSinif is not found,
     * or with status {@code 500 (Internal Server Error)} if the denemeAnalizSinif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deneme-analiz-sinifs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DenemeAnalizSinif> partialUpdateDenemeAnalizSinif(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DenemeAnalizSinif denemeAnalizSinif
    ) throws URISyntaxException {
        log.debug("REST request to partial update DenemeAnalizSinif partially : {}, {}", id, denemeAnalizSinif);
        if (denemeAnalizSinif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, denemeAnalizSinif.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!denemeAnalizSinifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DenemeAnalizSinif> result = denemeAnalizSinifRepository
            .findById(denemeAnalizSinif.getId())
            .map(existingDenemeAnalizSinif -> {
                if (denemeAnalizSinif.getOrtalama() != null) {
                    existingDenemeAnalizSinif.setOrtalama(denemeAnalizSinif.getOrtalama());
                }
                if (denemeAnalizSinif.getKonuAnalizJson() != null) {
                    existingDenemeAnalizSinif.setKonuAnalizJson(denemeAnalizSinif.getKonuAnalizJson());
                }

                return existingDenemeAnalizSinif;
            })
            .map(denemeAnalizSinifRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, denemeAnalizSinif.getId().toString())
        );
    }

    /**
     * {@code GET  /deneme-analiz-sinifs} : get all the denemeAnalizSinifs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of denemeAnalizSinifs in body.
     */
    @GetMapping("/deneme-analiz-sinifs")
    public List<DenemeAnalizSinif> getAllDenemeAnalizSinifs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all DenemeAnalizSinifs");
        return denemeAnalizSinifRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /deneme-analiz-sinifs/:id} : get the "id" denemeAnalizSinif.
     *
     * @param id the id of the denemeAnalizSinif to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the denemeAnalizSinif, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deneme-analiz-sinifs/{id}")
    public ResponseEntity<DenemeAnalizSinif> getDenemeAnalizSinif(@PathVariable Long id) {
        log.debug("REST request to get DenemeAnalizSinif : {}", id);
        Optional<DenemeAnalizSinif> denemeAnalizSinif = denemeAnalizSinifRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(denemeAnalizSinif);
    }

    /**
     * {@code DELETE  /deneme-analiz-sinifs/:id} : delete the "id" denemeAnalizSinif.
     *
     * @param id the id of the denemeAnalizSinif to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deneme-analiz-sinifs/{id}")
    public ResponseEntity<Void> deleteDenemeAnalizSinif(@PathVariable Long id) {
        log.debug("REST request to delete DenemeAnalizSinif : {}", id);
        denemeAnalizSinifRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
