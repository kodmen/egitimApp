package com.temrin.web.rest;

import com.temrin.domain.Mesaj;
import com.temrin.repository.MesajRepository;
import com.temrin.service.MesajService;
import com.temrin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
 * REST controller for managing {@link com.temrin.domain.Mesaj}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MesajResource {

    private final Logger log = LoggerFactory.getLogger(MesajResource.class);

    private static final String ENTITY_NAME = "mesaj";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MesajRepository mesajRepository;
    private final MesajService mesajService;

    public MesajResource(MesajRepository mesajRepository, MesajService mesajService) {
        this.mesajRepository = mesajRepository;
        this.mesajService = mesajService;
    }

    /**
     * {@code POST  /mesajs} : Create a new mesaj.
     *
     * @param mesaj the mesaj to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mesaj, or with status {@code 400 (Bad Request)} if the mesaj has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mesajs")
    public ResponseEntity<Mesaj> createMesaj(@RequestBody Mesaj mesaj) throws URISyntaxException {
        log.debug("REST request to save Mesaj : {}", mesaj);
        if (mesaj.getId() != null) {
            throw new BadRequestAlertException("A new mesaj cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mesaj result = mesajRepository.save(mesaj);
        return ResponseEntity
            .created(new URI("/api/mesajs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/mesajs/kullanici")
    public ResponseEntity<Mesaj> createMesajForUser(@RequestBody Mesaj mesaj) throws URISyntaxException {
        log.debug("REST request to save Mesaj : {}", mesaj);
        if (mesaj.getId() != null) {
            throw new BadRequestAlertException("A new mesaj cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mesaj result = mesajService.kullaniciMesajOlustur(mesaj);
        return ResponseEntity
            .created(new URI("/api/mesajs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mesajs/:id} : Updates an existing mesaj.
     *
     * @param id the id of the mesaj to save.
     * @param mesaj the mesaj to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mesaj,
     * or with status {@code 400 (Bad Request)} if the mesaj is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mesaj couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mesajs/{id}")
    public ResponseEntity<Mesaj> updateMesaj(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mesaj mesaj)
        throws URISyntaxException {
        log.debug("REST request to update Mesaj : {}, {}", id, mesaj);
        if (mesaj.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mesaj.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mesajRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mesaj result = mesajRepository.save(mesaj);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mesaj.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mesajs/:id} : Partial updates given fields of an existing mesaj, field will ignore if it is null
     *
     * @param id the id of the mesaj to save.
     * @param mesaj the mesaj to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mesaj,
     * or with status {@code 400 (Bad Request)} if the mesaj is not valid,
     * or with status {@code 404 (Not Found)} if the mesaj is not found,
     * or with status {@code 500 (Internal Server Error)} if the mesaj couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mesajs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mesaj> partialUpdateMesaj(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mesaj mesaj)
        throws URISyntaxException {
        log.debug("REST request to partial update Mesaj partially : {}, {}", id, mesaj);
        if (mesaj.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mesaj.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mesajRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mesaj> result = mesajRepository
            .findById(mesaj.getId())
            .map(existingMesaj -> {
                if (mesaj.getUserName() != null) {
                    existingMesaj.setUserName(mesaj.getUserName());
                }
                if (mesaj.getEposta() != null) {
                    existingMesaj.setEposta(mesaj.getEposta());
                }
                if (mesaj.getMesaj() != null) {
                    existingMesaj.setMesaj(mesaj.getMesaj());
                }
                if (mesaj.getGoruldu() != null) {
                    existingMesaj.setGoruldu(mesaj.getGoruldu());
                }
                if (mesaj.getTarih() != null) {
                    existingMesaj.setTarih(mesaj.getTarih());
                }

                return existingMesaj;
            })
            .map(mesajRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mesaj.getId().toString())
        );
    }

    /**
     * {@code GET  /mesajs} : get all the mesajs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mesajs in body.
     */
    @GetMapping("/mesajs")
    public ResponseEntity<List<Mesaj>> getAllMesajs(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Mesajs");
        Page<Mesaj> page = mesajRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /mesajs/:id} : get the "id" mesaj.
     *
     * @param id the id of the mesaj to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mesaj, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mesajs/{id}")
    public ResponseEntity<Mesaj> getMesaj(@PathVariable Long id) {
        log.debug("REST request to get Mesaj : {}", id);
        Optional<Mesaj> mesaj = mesajRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mesaj);
    }

    /**
     * {@code DELETE  /mesajs/:id} : delete the "id" mesaj.
     *
     * @param id the id of the mesaj to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mesajs/{id}")
    public ResponseEntity<Void> deleteMesaj(@PathVariable Long id) {
        log.debug("REST request to delete Mesaj : {}", id);
        mesajRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
