package com.temrin.web.rest;

import com.temrin.domain.Donem;
import com.temrin.repository.DonemRepository;
import com.temrin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.temrin.domain.Donem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DonemResource {

    private final Logger log = LoggerFactory.getLogger(DonemResource.class);

    private static final String ENTITY_NAME = "donem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DonemRepository donemRepository;

    public DonemResource(DonemRepository donemRepository) {
        this.donemRepository = donemRepository;
    }

    /**
     * {@code POST  /donems} : Create a new donem.
     *
     * @param donem the donem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new donem, or with status {@code 400 (Bad Request)} if the donem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/donems")
    public ResponseEntity<Donem> createDonem(@RequestBody Donem donem) throws URISyntaxException {
        log.debug("REST request to save Donem : {}", donem);
        if (donem.getId() != null) {
            throw new BadRequestAlertException("A new donem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Donem result = donemRepository.save(donem);
        return ResponseEntity
            .created(new URI("/api/donems/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /donems/:id} : Updates an existing donem.
     *
     * @param id the id of the donem to save.
     * @param donem the donem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donem,
     * or with status {@code 400 (Bad Request)} if the donem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the donem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/donems/{id}")
    public ResponseEntity<Donem> updateDonem(@PathVariable(value = "id", required = false) final Long id, @RequestBody Donem donem)
        throws URISyntaxException {
        log.debug("REST request to update Donem : {}, {}", id, donem);
        if (donem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Donem result = donemRepository.save(donem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, donem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /donems/:id} : Partial updates given fields of an existing donem, field will ignore if it is null
     *
     * @param id the id of the donem to save.
     * @param donem the donem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donem,
     * or with status {@code 400 (Bad Request)} if the donem is not valid,
     * or with status {@code 404 (Not Found)} if the donem is not found,
     * or with status {@code 500 (Internal Server Error)} if the donem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/donems/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Donem> partialUpdateDonem(@PathVariable(value = "id", required = false) final Long id, @RequestBody Donem donem)
        throws URISyntaxException {
        log.debug("REST request to partial update Donem partially : {}, {}", id, donem);
        if (donem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Donem> result = donemRepository
            .findById(donem.getId())
            .map(existingDonem -> {
                if (donem.getIsim() != null) {
                    existingDonem.setIsim(donem.getIsim());
                }

                return existingDonem;
            })
            .map(donemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, donem.getId().toString())
        );
    }

    /**
     * {@code GET  /donems} : get all the donems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of donems in body.
     */
    @GetMapping("/donems")
    public List<Donem> getAllDonems() {
        log.debug("REST request to get all Donems");
        return donemRepository.findAll();
    }

    /**
     * {@code GET  /donems/:id} : get the "id" donem.
     *
     * @param id the id of the donem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the donem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/donems/{id}")
    public ResponseEntity<Donem> getDonem(@PathVariable Long id) {
        log.debug("REST request to get Donem : {}", id);
        Optional<Donem> donem = donemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(donem);
    }

    /**
     * {@code DELETE  /donems/:id} : delete the "id" donem.
     *
     * @param id the id of the donem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/donems/{id}")
    public ResponseEntity<Void> deleteDonem(@PathVariable Long id) {
        log.debug("REST request to delete Donem : {}", id);
        donemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
