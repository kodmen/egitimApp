package com.temrin.web.rest;

import com.temrin.domain.Grup;
import com.temrin.repository.GrupRepository;
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
 * REST controller for managing {@link com.temrin.domain.Grup}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GrupResource {

    private final Logger log = LoggerFactory.getLogger(GrupResource.class);

    private static final String ENTITY_NAME = "grup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrupRepository grupRepository;

    public GrupResource(GrupRepository grupRepository) {
        this.grupRepository = grupRepository;
    }

    /**
     * {@code POST  /grups} : Create a new grup.
     *
     * @param grup the grup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grup, or with status {@code 400 (Bad Request)} if the grup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grups")
    public ResponseEntity<Grup> createGrup(@Valid @RequestBody Grup grup) throws URISyntaxException {
        log.debug("REST request to save Grup : {}", grup);
        if (grup.getId() != null) {
            throw new BadRequestAlertException("A new grup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Grup result = grupRepository.save(grup);
        return ResponseEntity
            .created(new URI("/api/grups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grups/:id} : Updates an existing grup.
     *
     * @param id the id of the grup to save.
     * @param grup the grup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grup,
     * or with status {@code 400 (Bad Request)} if the grup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grups/{id}")
    public ResponseEntity<Grup> updateGrup(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Grup grup)
        throws URISyntaxException {
        log.debug("REST request to update Grup : {}, {}", id, grup);
        if (grup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Grup result = grupRepository.save(grup);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grup.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grups/:id} : Partial updates given fields of an existing grup, field will ignore if it is null
     *
     * @param id the id of the grup to save.
     * @param grup the grup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grup,
     * or with status {@code 400 (Bad Request)} if the grup is not valid,
     * or with status {@code 404 (Not Found)} if the grup is not found,
     * or with status {@code 500 (Internal Server Error)} if the grup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grups/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Grup> partialUpdateGrup(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Grup grup
    ) throws URISyntaxException {
        log.debug("REST request to partial update Grup partially : {}, {}", id, grup);
        if (grup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Grup> result = grupRepository
            .findById(grup.getId())
            .map(existingGrup -> {
                if (grup.getIsim() != null) {
                    existingGrup.setIsim(grup.getIsim());
                }

                return existingGrup;
            })
            .map(grupRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grup.getId().toString())
        );
    }

    /**
     * {@code GET  /grups} : get all the grups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grups in body.
     */
    @GetMapping("/grups")
    public List<Grup> getAllGrups() {
        log.debug("REST request to get all Grups");
        return grupRepository.findAll();
    }

    /**
     * {@code GET  /grups/:id} : get the "id" grup.
     *
     * @param id the id of the grup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grups/{id}")
    public ResponseEntity<Grup> getGrup(@PathVariable Long id) {
        log.debug("REST request to get Grup : {}", id);
        Optional<Grup> grup = grupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grup);
    }

    /**
     * {@code DELETE  /grups/:id} : delete the "id" grup.
     *
     * @param id the id of the grup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grups/{id}")
    public ResponseEntity<Void> deleteGrup(@PathVariable Long id) {
        log.debug("REST request to delete Grup : {}", id);
        grupRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
