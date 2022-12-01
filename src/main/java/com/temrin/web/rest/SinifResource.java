package com.temrin.web.rest;

import com.temrin.config.Constants;
import com.temrin.domain.Sinif;
import com.temrin.repository.SinifRepository;
import com.temrin.security.AuthoritiesConstants;
import com.temrin.service.SinifService;
import com.temrin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.temrin.domain.Sinif}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SinifResource {

    private final Logger log = LoggerFactory.getLogger(SinifResource.class);

    private static final String ENTITY_NAME = "sinif";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SinifRepository sinifRepository;
    private final SinifService sinifService;

    public SinifResource(SinifRepository sinifRepository, SinifService sinifService) {
        this.sinifRepository = sinifRepository;
        this.sinifService = sinifService;
    }

    /**
     * {@code POST  /sinifs} : Create a new sinif.
     *
     * @param sinif the sinif to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sinif, or with status {@code 400 (Bad Request)} if the sinif has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sinifs")
    public ResponseEntity<Sinif> createSinif(@Valid @RequestBody Sinif sinif) throws URISyntaxException {
        log.debug("REST request to save Sinif : {}", sinif);
        if (sinif.getId() != null) {
            throw new BadRequestAlertException("A new sinif cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sinif result = sinifRepository.save(sinif);
        return ResponseEntity
            .created(new URI("/api/sinifs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sinifs/:id} : Updates an existing sinif.
     *
     * @param id the id of the sinif to save.
     * @param sinif the sinif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sinif,
     * or with status {@code 400 (Bad Request)} if the sinif is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sinif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sinifs/{id}")
    public ResponseEntity<Sinif> updateSinif(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Sinif sinif)
        throws URISyntaxException {
        log.debug("REST request to update Sinif : {}, {}", id, sinif);
        if (sinif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sinif.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sinifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sinif result = sinifRepository.save(sinif);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sinif.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sinifs/:id} : Partial updates given fields of an existing sinif, field will ignore if it is null
     *
     * @param id the id of the sinif to save.
     * @param sinif the sinif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sinif,
     * or with status {@code 400 (Bad Request)} if the sinif is not valid,
     * or with status {@code 404 (Not Found)} if the sinif is not found,
     * or with status {@code 500 (Internal Server Error)} if the sinif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sinifs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Sinif> partialUpdateSinif(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Sinif sinif
    ) throws URISyntaxException {
        log.debug("REST request to partial update Sinif partially : {}, {}", id, sinif);
        if (sinif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sinif.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sinifRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sinif> result = sinifRepository
            .findById(sinif.getId())
            .map(existingSinif -> {
                if (sinif.getIsim() != null) {
                    existingSinif.setIsim(sinif.getIsim());
                }
                if (sinif.getKonulimizjson() != null) {
                    existingSinif.setKonulimizjson(sinif.getKonulimizjson());
                }

                return existingSinif;
            })
            .map(sinifRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sinif.getId().toString())
        );
    }

    /**
     * {@code GET  /sinifs} : get all the sinifs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sinifs in body.
     */
    @GetMapping("/sinifs")
    public List<Sinif> getAllSinifs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Sinifs");
//        return sinifRepository.findAllWithEagerRelationships();
        return sinifService.getAllSinif();    }

    /**
     * {@code GET  /sinifs/:id} : get the "id" sinif.
     *
     * @param id the id of the sinif to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sinif, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sinifs/{id}")
    public ResponseEntity<Sinif> getSinif(@PathVariable Long id) {
        log.debug("REST request to get Sinif : {}", id);
        Optional<Sinif> sinif = sinifRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(sinif);
    }

    /**
     * {@code DELETE  /sinifs/:id} : delete the "id" sinif.
     *
     * @param id the id of the sinif to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sinifs/{id}")
    public ResponseEntity<Void> deleteSinif(@PathVariable Long id) {
        log.debug("REST request to delete Sinif : {}", id);
        sinifRepository.deleteById(id);
        // burda ne oluyor
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/sinifs/user")
    public ResponseEntity<Boolean> getUserbysinif() {
        log.debug("REST request to get User : {}" );
        boolean varmi = sinifService.ogrenciSinifIceriyormu();
        return ResponseEntity.ok(varmi);
    }

    @GetMapping("/sinifs/yurt/{id}")
    public ResponseEntity<List<Sinif>> getSinifByYurt(@PathVariable long id) {
        log.debug("REST request to get Sinif by yurt : {}", id);
        return ResponseEntity.ok(sinifService.getSinifByYurt(id));
    }

    @GetMapping("/sinifs/yurt-ekle/{id}")
    public ResponseEntity ogrSinifEkle(@PathVariable long id) {
        log.debug("REST request to get Sinif by yurt : {}", id);
        sinifService.ogrenciSinifaEkle(id);
        return ResponseEntity.ok().build();
    }


}
