package com.temrin.web.rest;

import com.temrin.domain.Yurt;
import com.temrin.repository.YurtRepository;
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
 * REST controller for managing {@link com.temrin.domain.Yurt}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class YurtResource {

    private final Logger log = LoggerFactory.getLogger(YurtResource.class);

    private static final String ENTITY_NAME = "yurt";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final YurtRepository yurtRepository;

    public YurtResource(YurtRepository yurtRepository) {
        this.yurtRepository = yurtRepository;
    }

    /**
     * {@code POST  /yurts} : Create a new yurt.
     *
     * @param yurt the yurt to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new yurt, or with status {@code 400 (Bad Request)} if the yurt has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/yurts")
    public ResponseEntity<Yurt> createYurt(@Valid @RequestBody Yurt yurt) throws URISyntaxException {
        log.debug("REST request to save Yurt : {}", yurt);
        if (yurt.getId() != null) {
            throw new BadRequestAlertException("A new yurt cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Yurt result = yurtRepository.save(yurt);
        return ResponseEntity
            .created(new URI("/api/yurts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /yurts/:id} : Updates an existing yurt.
     *
     * @param id the id of the yurt to save.
     * @param yurt the yurt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated yurt,
     * or with status {@code 400 (Bad Request)} if the yurt is not valid,
     * or with status {@code 500 (Internal Server Error)} if the yurt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/yurts/{id}")
    public ResponseEntity<Yurt> updateYurt(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Yurt yurt)
        throws URISyntaxException {
        log.debug("REST request to update Yurt : {}, {}", id, yurt);
        if (yurt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, yurt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!yurtRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Yurt result = yurtRepository.save(yurt);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, yurt.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /yurts/:id} : Partial updates given fields of an existing yurt, field will ignore if it is null
     *
     * @param id the id of the yurt to save.
     * @param yurt the yurt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated yurt,
     * or with status {@code 400 (Bad Request)} if the yurt is not valid,
     * or with status {@code 404 (Not Found)} if the yurt is not found,
     * or with status {@code 500 (Internal Server Error)} if the yurt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/yurts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Yurt> partialUpdateYurt(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Yurt yurt
    ) throws URISyntaxException {
        log.debug("REST request to partial update Yurt partially : {}, {}", id, yurt);
        if (yurt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, yurt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!yurtRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Yurt> result = yurtRepository
            .findById(yurt.getId())
            .map(existingYurt -> {
                if (yurt.getIsim() != null) {
                    existingYurt.setIsim(yurt.getIsim());
                }

                return existingYurt;
            })
            .map(yurtRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, yurt.getId().toString())
        );
    }

    /**
     * {@code GET  /yurts} : get all the yurts.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of yurts in body.
     */
    @GetMapping("/yurts")
    public List<Yurt> getAllYurts(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Yurts");
        return yurtRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /yurts/:id} : get the "id" yurt.
     *
     * @param id the id of the yurt to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the yurt, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/yurts/{id}")
    public ResponseEntity<Yurt> getYurt(@PathVariable Long id) {
        log.debug("REST request to get Yurt : {}", id);
        Optional<Yurt> yurt = yurtRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(yurt);
    }

    /**
     * {@code DELETE  /yurts/:id} : delete the "id" yurt.
     *
     * @param id the id of the yurt to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/yurts/{id}")
    public ResponseEntity<Void> deleteYurt(@PathVariable Long id) {
        log.debug("REST request to delete Yurt : {}", id);
        yurtRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
