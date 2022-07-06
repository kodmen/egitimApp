package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.Grup;
import com.temrin.repository.GrupRepository;
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
 * Integration tests for the {@link GrupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrupResourceIT {

    private static final String DEFAULT_ISIM = "AAAAAAAAAA";
    private static final String UPDATED_ISIM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/grups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GrupRepository grupRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGrupMockMvc;

    private Grup grup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grup createEntity(EntityManager em) {
        Grup grup = new Grup().isim(DEFAULT_ISIM);
        return grup;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grup createUpdatedEntity(EntityManager em) {
        Grup grup = new Grup().isim(UPDATED_ISIM);
        return grup;
    }

    @BeforeEach
    public void initTest() {
        grup = createEntity(em);
    }

    @Test
    @Transactional
    void createGrup() throws Exception {
        int databaseSizeBeforeCreate = grupRepository.findAll().size();
        // Create the Grup
        restGrupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grup)))
            .andExpect(status().isCreated());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeCreate + 1);
        Grup testGrup = grupList.get(grupList.size() - 1);
        assertThat(testGrup.getIsim()).isEqualTo(DEFAULT_ISIM);
    }

    @Test
    @Transactional
    void createGrupWithExistingId() throws Exception {
        // Create the Grup with an existing ID
        grup.setId(1L);

        int databaseSizeBeforeCreate = grupRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grup)))
            .andExpect(status().isBadRequest());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGrups() throws Exception {
        // Initialize the database
        grupRepository.saveAndFlush(grup);

        // Get all the grupList
        restGrupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grup.getId().intValue())))
            .andExpect(jsonPath("$.[*].isim").value(hasItem(DEFAULT_ISIM)));
    }

    @Test
    @Transactional
    void getGrup() throws Exception {
        // Initialize the database
        grupRepository.saveAndFlush(grup);

        // Get the grup
        restGrupMockMvc
            .perform(get(ENTITY_API_URL_ID, grup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grup.getId().intValue()))
            .andExpect(jsonPath("$.isim").value(DEFAULT_ISIM));
    }

    @Test
    @Transactional
    void getNonExistingGrup() throws Exception {
        // Get the grup
        restGrupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGrup() throws Exception {
        // Initialize the database
        grupRepository.saveAndFlush(grup);

        int databaseSizeBeforeUpdate = grupRepository.findAll().size();

        // Update the grup
        Grup updatedGrup = grupRepository.findById(grup.getId()).get();
        // Disconnect from session so that the updates on updatedGrup are not directly saved in db
        em.detach(updatedGrup);
        updatedGrup.isim(UPDATED_ISIM);

        restGrupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrup))
            )
            .andExpect(status().isOk());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
        Grup testGrup = grupList.get(grupList.size() - 1);
        assertThat(testGrup.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void putNonExistingGrup() throws Exception {
        int databaseSizeBeforeUpdate = grupRepository.findAll().size();
        grup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grup))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrup() throws Exception {
        int databaseSizeBeforeUpdate = grupRepository.findAll().size();
        grup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grup))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrup() throws Exception {
        int databaseSizeBeforeUpdate = grupRepository.findAll().size();
        grup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGrupWithPatch() throws Exception {
        // Initialize the database
        grupRepository.saveAndFlush(grup);

        int databaseSizeBeforeUpdate = grupRepository.findAll().size();

        // Update the grup using partial update
        Grup partialUpdatedGrup = new Grup();
        partialUpdatedGrup.setId(grup.getId());

        restGrupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrup))
            )
            .andExpect(status().isOk());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
        Grup testGrup = grupList.get(grupList.size() - 1);
        assertThat(testGrup.getIsim()).isEqualTo(DEFAULT_ISIM);
    }

    @Test
    @Transactional
    void fullUpdateGrupWithPatch() throws Exception {
        // Initialize the database
        grupRepository.saveAndFlush(grup);

        int databaseSizeBeforeUpdate = grupRepository.findAll().size();

        // Update the grup using partial update
        Grup partialUpdatedGrup = new Grup();
        partialUpdatedGrup.setId(grup.getId());

        partialUpdatedGrup.isim(UPDATED_ISIM);

        restGrupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrup))
            )
            .andExpect(status().isOk());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
        Grup testGrup = grupList.get(grupList.size() - 1);
        assertThat(testGrup.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void patchNonExistingGrup() throws Exception {
        int databaseSizeBeforeUpdate = grupRepository.findAll().size();
        grup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grup))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrup() throws Exception {
        int databaseSizeBeforeUpdate = grupRepository.findAll().size();
        grup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grup))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrup() throws Exception {
        int databaseSizeBeforeUpdate = grupRepository.findAll().size();
        grup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grup in the database
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrup() throws Exception {
        // Initialize the database
        grupRepository.saveAndFlush(grup);

        int databaseSizeBeforeDelete = grupRepository.findAll().size();

        // Delete the grup
        restGrupMockMvc
            .perform(delete(ENTITY_API_URL_ID, grup.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Grup> grupList = grupRepository.findAll();
        assertThat(grupList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
