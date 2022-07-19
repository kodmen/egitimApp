package com.temrin.web.rest;

import com.temrin.domain.Deneme;
import com.temrin.repository.DenemeRepository;
import com.temrin.service.DenemeService;
import com.temrin.service.dto.DenemeDTO;
import com.temrin.service.dto.deneme.DenemeCevapRequest;
import com.temrin.service.dto.deneme.DenemeSinavDto;
import com.temrin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
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
 * REST controller for managing {@link com.temrin.domain.Deneme}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DenemeResource {

    private final Logger log = LoggerFactory.getLogger(DenemeResource.class);

    private static final String ENTITY_NAME = "deneme";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DenemeRepository denemeRepository;
    private final DenemeService denemeService;

    public DenemeResource(DenemeRepository denemeRepository, DenemeService denemeService) {
        this.denemeRepository = denemeRepository;
        this.denemeService = denemeService;
    }

    /**
     * {@code POST  /denemes} : Create a new deneme.
     *
     * @param deneme the deneme to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new deneme, or with status {@code 400 (Bad Request)} if the deneme has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/denemes")
    public ResponseEntity<Deneme> createDeneme(@Valid @RequestBody DenemeDTO deneme) throws URISyntaxException, ParseException {
        log.debug("REST request to save Deneme : {}", deneme);
//        if (deneme.getId() != null) {
//            throw new BadRequestAlertException("A new deneme cannot already have an ID", ENTITY_NAME, "idexists");
//        }
        Deneme result = denemeService.create(deneme);
        return ResponseEntity
            .created(new URI("/api/denemes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /denemes/:id} : Updates an existing deneme.
     *
     * @param id the id of the deneme to save.
     * @param deneme the deneme to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deneme,
     * or with status {@code 400 (Bad Request)} if the deneme is not valid,
     * or with status {@code 500 (Internal Server Error)} if the deneme couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/denemes/{id}")
    public ResponseEntity<Deneme> updateDeneme(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Deneme deneme
    ) throws URISyntaxException {
        log.debug("REST request to update Deneme : {}, {}", id, deneme);
        if (deneme.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deneme.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!denemeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Deneme result = denemeRepository.save(deneme);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deneme.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /denemes/:id} : Partial updates given fields of an existing deneme, field will ignore if it is null
     *
     * @param id the id of the deneme to save.
     * @param deneme the deneme to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deneme,
     * or with status {@code 400 (Bad Request)} if the deneme is not valid,
     * or with status {@code 404 (Not Found)} if the deneme is not found,
     * or with status {@code 500 (Internal Server Error)} if the deneme couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/denemes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Deneme> partialUpdateDeneme(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Deneme deneme
    ) throws URISyntaxException {
        log.debug("REST request to partial update Deneme partially : {}, {}", id, deneme);
        if (deneme.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deneme.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!denemeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Deneme> result = denemeRepository
            .findById(deneme.getId())
            .map(existingDeneme -> {
                if (deneme.getIsim() != null) {
                    existingDeneme.setIsim(deneme.getIsim());
                }
                if (deneme.getOlusturmaTarih() != null) {
                    existingDeneme.setOlusturmaTarih(deneme.getOlusturmaTarih());
                }
                if (deneme.getBaslamaTarih() != null) {
                    existingDeneme.setBaslamaTarih(deneme.getBaslamaTarih());
                }
                if (deneme.getSure() != null) {
                    existingDeneme.setSure(deneme.getSure());
                }
                if (deneme.getCevapAnahtar() != null) {
                    existingDeneme.setCevapAnahtar(deneme.getCevapAnahtar());
                }
                if (deneme.getDenemeInfoJson() != null) {
                    existingDeneme.setDenemeInfoJson(deneme.getDenemeInfoJson());
                }

                return existingDeneme;
            })
            .map(denemeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deneme.getId().toString())
        );
    }

    /**
     * {@code GET  /denemes} : get all the denemes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of denemes in body.
     */
    @GetMapping("/denemes")
    public List<Deneme> getAllDenemes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Denemes");
//        return denemeRepository.findAllWithEagerRelationships();
        return denemeService.getAllDeneme();
    }

    /**
     * {@code GET  /denemes} : get all the denemes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of denemes in body.
     */
    @GetMapping("/denemes/girmismi/{id}")
    public boolean getDenemeGirmismi(@PathVariable Long id) {
        log.debug("REST request to get all Denemes");
        return denemeService.ogrDenemeyeGirmismi(id);
    }

    /**
     * {@code GET  /denemes/:id} : get the "id" deneme.
     * burda denemeye gireceğimiz soruları getircez
     * @param id the id of the deneme to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the deneme, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/denemeSinva/{id}")
    public DenemeSinavDto getDenemeGiris(@PathVariable Long id) {
        return denemeService.denemeSinavOlustur(id);
    }

    /**
     * {@code POST  /denemes} : Create a new deneme.
     *
     * @param deneme the deneme to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new deneme, or with status {@code 400 (Bad Request)} if the deneme has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/denemes/cevaplar")
    public long denemeCevap(@Valid @RequestBody DenemeCevapRequest deneme) throws URISyntaxException, ParseException {
        log.debug("REST request to save Deneme : {}", deneme);

        return denemeService.cevapKontrol(deneme);
    }

    /**
     * {@code GET  /denemes/:id} : get the "id" deneme.
     *
     * @param id the id of the deneme to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the deneme, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/denemes/{id}")
    public ResponseEntity<Deneme> getDeneme(@PathVariable Long id) {
        log.debug("REST request to get Deneme : {}", id);
        Optional<Deneme> deneme = denemeRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(deneme);
    }

    /**
     * {@code DELETE  /denemes/:id} : delete the "id" deneme.
     *
     * @param id the id of the deneme to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/denemes/{id}")
    public ResponseEntity<Void> deleteDeneme(@PathVariable Long id) {
        log.debug("REST request to delete Deneme : {}", id);
        denemeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
