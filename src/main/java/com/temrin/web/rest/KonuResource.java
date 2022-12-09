package com.temrin.web.rest;

import com.temrin.domain.Konu;
import com.temrin.domain.Mesaj;
import com.temrin.repository.KonuRepository;
import com.temrin.service.KonuService;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.temrin.domain.Konu}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KonuResource {

    private final Logger log = LoggerFactory.getLogger(KonuResource.class);

    private static final String ENTITY_NAME = "konu";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KonuRepository konuRepository;
    private final KonuService konuService;

    public KonuResource(KonuRepository konuRepository, KonuService konuService) {
        this.konuRepository = konuRepository;
        this.konuService = konuService;
    }

    /**
     * {@code POST  /konus} : Create a new konu.
     *
     * @param konu the konu to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new konu, or with status {@code 400 (Bad Request)} if the konu has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/konus")
    public ResponseEntity<Konu> createKonu(@Valid @RequestBody Konu konu) throws URISyntaxException {
        log.debug("REST request to save Konu : {}", konu);
        if (konu.getId() != null) {
            throw new BadRequestAlertException("A new konu cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Konu result = konuRepository.save(konu);
        return ResponseEntity
            .created(new URI("/api/konus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /konus/:id} : Updates an existing konu.
     *
     * @param id the id of the konu to save.
     * @param konu the konu to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated konu,
     * or with status {@code 400 (Bad Request)} if the konu is not valid,
     * or with status {@code 500 (Internal Server Error)} if the konu couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/konus/{id}")
    public ResponseEntity<Konu> updateKonu(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Konu konu)
        throws URISyntaxException {
        log.debug("REST request to update Konu : {}, {}", id, konu);
        if (konu.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, konu.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!konuRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Konu result = konuRepository.save(konu);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, konu.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /konus/:id} : Partial updates given fields of an existing konu, field will ignore if it is null
     *
     * @param id the id of the konu to save.
     * @param konu the konu to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated konu,
     * or with status {@code 400 (Bad Request)} if the konu is not valid,
     * or with status {@code 404 (Not Found)} if the konu is not found,
     * or with status {@code 500 (Internal Server Error)} if the konu couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/konus/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Konu> partialUpdateKonu(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Konu konu
    ) throws URISyntaxException {
        log.debug("REST request to partial update Konu partially : {}, {}", id, konu);
        if (konu.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, konu.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!konuRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Konu> result = konuRepository
            .findById(konu.getId())
            .map(existingKonu -> {
                if (konu.getIsim() != null) {
                    existingKonu.setIsim(konu.getIsim());
                }

                return existingKonu;
            })
            .map(konuRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, konu.getId().toString())
        );
    }

    /**
     * {@code GET  /konus} : get all the konus.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of konus in body.
     */
    @GetMapping("/konus")
    public List<Konu> getAllKonus() {
        log.debug("REST request to get all Konus");

        return konuService.getAll();
    }

    /**
     * {@code GET  /mesajs} : get all the mesajs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mesajs in body.
     */
    @GetMapping("/konus/page")
    public ResponseEntity<List<Konu>> getAllKonus(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Mesajs");
        Page<Konu> page = konuRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }


    @GetMapping("/konus/grup/{id}")
    public List<Konu> getAllKonusByGrupId(@PathVariable Long id) {
        if (id == null){
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "id null");
        }
        log.debug("REST request to get all Konus");
        return konuService.getKonuByGrupId(id);
    }

    /**
     * {@code GET  /konus/:id} : get the "id" konu.
     *
     * @param id the id of the konu to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the konu, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/konus/{id}")
    public ResponseEntity<Konu> getKonu(@PathVariable Long id) {
        log.debug("REST request to get Konu : {}", id);
        Optional<Konu> konu = konuRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(konu);
    }

    /**
     * {@code DELETE  /konus/:id} : delete the "id" konu.
     *
     * @param id the id of the konu to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/konus/{id}")
    public ResponseEntity<Void> deleteKonu(@PathVariable Long id) {
        log.debug("REST request to delete Konu : {}", id);
        konuRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
