package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.Konu;
import com.temrin.repository.KonuRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link KonuResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KonuResourceIT {

    private static final String DEFAULT_ISIM = "AAAAAAAAAA";
    private static final String UPDATED_ISIM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/konus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KonuRepository konuRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKonuMockMvc;

    private Konu konu;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Konu createEntity(EntityManager em) {
        Konu konu = new Konu().isim(DEFAULT_ISIM);
        return konu;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Konu createUpdatedEntity(EntityManager em) {
        Konu konu = new Konu().isim(UPDATED_ISIM);
        return konu;
    }

    @BeforeEach
    public void initTest() {
        konu = createEntity(em);
    }

    @Test
    @Transactional
    void createKonu() throws Exception {
        int databaseSizeBeforeCreate = konuRepository.findAll().size();
        // Create the Konu
        restKonuMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(konu)))
            .andExpect(status().isCreated());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeCreate + 1);
        Konu testKonu = konuList.get(konuList.size() - 1);
        assertThat(testKonu.getIsim()).isEqualTo(DEFAULT_ISIM);
    }

    @Test
    @Transactional
    void createKonuWithExistingId() throws Exception {
        // Create the Konu with an existing ID
        konu.setId(1L);

        int databaseSizeBeforeCreate = konuRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKonuMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(konu)))
            .andExpect(status().isBadRequest());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKonus() throws Exception {
        // Initialize the database
        konuRepository.saveAndFlush(konu);

        // Get all the konuList
        restKonuMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(konu.getId().intValue())))
            .andExpect(jsonPath("$.[*].isim").value(hasItem(DEFAULT_ISIM)));
    }

    @Test
    @Transactional
    void getKonu() throws Exception {
        // Initialize the database
        konuRepository.saveAndFlush(konu);

        // Get the konu
        restKonuMockMvc
            .perform(get(ENTITY_API_URL_ID, konu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(konu.getId().intValue()))
            .andExpect(jsonPath("$.isim").value(DEFAULT_ISIM));
    }

    @Test
    @Transactional
    void getNonExistingKonu() throws Exception {
        // Get the konu
        restKonuMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewKonu() throws Exception {
        // Initialize the database
        konuRepository.saveAndFlush(konu);

        int databaseSizeBeforeUpdate = konuRepository.findAll().size();

        // Update the konu
        Konu updatedKonu = konuRepository.findById(konu.getId()).get();
        // Disconnect from session so that the updates on updatedKonu are not directly saved in db
        em.detach(updatedKonu);
        updatedKonu.isim(UPDATED_ISIM);

        restKonuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKonu.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKonu))
            )
            .andExpect(status().isOk());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
        Konu testKonu = konuList.get(konuList.size() - 1);
        assertThat(testKonu.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void putNonExistingKonu() throws Exception {
        int databaseSizeBeforeUpdate = konuRepository.findAll().size();
        konu.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKonuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, konu.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(konu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKonu() throws Exception {
        int databaseSizeBeforeUpdate = konuRepository.findAll().size();
        konu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKonuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(konu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKonu() throws Exception {
        int databaseSizeBeforeUpdate = konuRepository.findAll().size();
        konu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKonuMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(konu)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKonuWithPatch() throws Exception {
        // Initialize the database
        konuRepository.saveAndFlush(konu);

        int databaseSizeBeforeUpdate = konuRepository.findAll().size();

        // Update the konu using partial update
        Konu partialUpdatedKonu = new Konu();
        partialUpdatedKonu.setId(konu.getId());

        partialUpdatedKonu.isim(UPDATED_ISIM);

        restKonuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKonu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKonu))
            )
            .andExpect(status().isOk());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
        Konu testKonu = konuList.get(konuList.size() - 1);
        assertThat(testKonu.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void fullUpdateKonuWithPatch() throws Exception {
        // Initialize the database
        konuRepository.saveAndFlush(konu);

        int databaseSizeBeforeUpdate = konuRepository.findAll().size();

        // Update the konu using partial update
        Konu partialUpdatedKonu = new Konu();
        partialUpdatedKonu.setId(konu.getId());

        partialUpdatedKonu.isim(UPDATED_ISIM);

        restKonuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKonu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKonu))
            )
            .andExpect(status().isOk());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
        Konu testKonu = konuList.get(konuList.size() - 1);
        assertThat(testKonu.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void patchNonExistingKonu() throws Exception {
        int databaseSizeBeforeUpdate = konuRepository.findAll().size();
        konu.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKonuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, konu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(konu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKonu() throws Exception {
        int databaseSizeBeforeUpdate = konuRepository.findAll().size();
        konu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKonuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(konu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKonu() throws Exception {
        int databaseSizeBeforeUpdate = konuRepository.findAll().size();
        konu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKonuMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(konu)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Konu in the database
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKonu() throws Exception {
        // Initialize the database
        konuRepository.saveAndFlush(konu);

        int databaseSizeBeforeDelete = konuRepository.findAll().size();

        // Delete the konu
        restKonuMockMvc
            .perform(delete(ENTITY_API_URL_ID, konu.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Konu> konuList = konuRepository.findAll();
        assertThat(konuList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
