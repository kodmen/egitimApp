package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.DenemeAnalizSinif;
import com.temrin.repository.DenemeAnalizSinifRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DenemeAnalizSinifResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DenemeAnalizSinifResourceIT {

    private static final Float DEFAULT_ORTALAMA = 1F;
    private static final Float UPDATED_ORTALAMA = 2F;

    private static final String DEFAULT_KONU_ANALIZ_JSON = "AAAAAAAAAA";
    private static final String UPDATED_KONU_ANALIZ_JSON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/deneme-analiz-sinifs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DenemeAnalizSinifRepository denemeAnalizSinifRepository;

    @Mock
    private DenemeAnalizSinifRepository denemeAnalizSinifRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDenemeAnalizSinifMockMvc;

    private DenemeAnalizSinif denemeAnalizSinif;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DenemeAnalizSinif createEntity(EntityManager em) {
        DenemeAnalizSinif denemeAnalizSinif = new DenemeAnalizSinif().ortalama(DEFAULT_ORTALAMA).konuAnalizJson(DEFAULT_KONU_ANALIZ_JSON);
        return denemeAnalizSinif;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DenemeAnalizSinif createUpdatedEntity(EntityManager em) {
        DenemeAnalizSinif denemeAnalizSinif = new DenemeAnalizSinif().ortalama(UPDATED_ORTALAMA).konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);
        return denemeAnalizSinif;
    }

    @BeforeEach
    public void initTest() {
        denemeAnalizSinif = createEntity(em);
    }

    @Test
    @Transactional
    void createDenemeAnalizSinif() throws Exception {
        int databaseSizeBeforeCreate = denemeAnalizSinifRepository.findAll().size();
        // Create the DenemeAnalizSinif
        restDenemeAnalizSinifMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isCreated());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeCreate + 1);
        DenemeAnalizSinif testDenemeAnalizSinif = denemeAnalizSinifList.get(denemeAnalizSinifList.size() - 1);
        assertThat(testDenemeAnalizSinif.getOrtalama()).isEqualTo(DEFAULT_ORTALAMA);
        assertThat(testDenemeAnalizSinif.getKonuAnalizJson()).isEqualTo(DEFAULT_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void createDenemeAnalizSinifWithExistingId() throws Exception {
        // Create the DenemeAnalizSinif with an existing ID
        denemeAnalizSinif.setId(1L);

        int databaseSizeBeforeCreate = denemeAnalizSinifRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDenemeAnalizSinifMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDenemeAnalizSinifs() throws Exception {
        // Initialize the database
        denemeAnalizSinifRepository.saveAndFlush(denemeAnalizSinif);

        // Get all the denemeAnalizSinifList
        restDenemeAnalizSinifMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(denemeAnalizSinif.getId().intValue())))
            .andExpect(jsonPath("$.[*].ortalama").value(hasItem(DEFAULT_ORTALAMA.doubleValue())))
            .andExpect(jsonPath("$.[*].konuAnalizJson").value(hasItem(DEFAULT_KONU_ANALIZ_JSON)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDenemeAnalizSinifsWithEagerRelationshipsIsEnabled() throws Exception {
        when(denemeAnalizSinifRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDenemeAnalizSinifMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(denemeAnalizSinifRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDenemeAnalizSinifsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(denemeAnalizSinifRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDenemeAnalizSinifMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(denemeAnalizSinifRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getDenemeAnalizSinif() throws Exception {
        // Initialize the database
        denemeAnalizSinifRepository.saveAndFlush(denemeAnalizSinif);

        // Get the denemeAnalizSinif
        restDenemeAnalizSinifMockMvc
            .perform(get(ENTITY_API_URL_ID, denemeAnalizSinif.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(denemeAnalizSinif.getId().intValue()))
            .andExpect(jsonPath("$.ortalama").value(DEFAULT_ORTALAMA.doubleValue()))
            .andExpect(jsonPath("$.konuAnalizJson").value(DEFAULT_KONU_ANALIZ_JSON));
    }

    @Test
    @Transactional
    void getNonExistingDenemeAnalizSinif() throws Exception {
        // Get the denemeAnalizSinif
        restDenemeAnalizSinifMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDenemeAnalizSinif() throws Exception {
        // Initialize the database
        denemeAnalizSinifRepository.saveAndFlush(denemeAnalizSinif);

        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();

        // Update the denemeAnalizSinif
        DenemeAnalizSinif updatedDenemeAnalizSinif = denemeAnalizSinifRepository.findById(denemeAnalizSinif.getId()).get();
        // Disconnect from session so that the updates on updatedDenemeAnalizSinif are not directly saved in db
        em.detach(updatedDenemeAnalizSinif);
        updatedDenemeAnalizSinif.ortalama(UPDATED_ORTALAMA).konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);

        restDenemeAnalizSinifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDenemeAnalizSinif.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDenemeAnalizSinif))
            )
            .andExpect(status().isOk());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
        DenemeAnalizSinif testDenemeAnalizSinif = denemeAnalizSinifList.get(denemeAnalizSinifList.size() - 1);
        assertThat(testDenemeAnalizSinif.getOrtalama()).isEqualTo(UPDATED_ORTALAMA);
        assertThat(testDenemeAnalizSinif.getKonuAnalizJson()).isEqualTo(UPDATED_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void putNonExistingDenemeAnalizSinif() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();
        denemeAnalizSinif.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDenemeAnalizSinifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, denemeAnalizSinif.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDenemeAnalizSinif() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();
        denemeAnalizSinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizSinifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDenemeAnalizSinif() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();
        denemeAnalizSinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizSinifMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDenemeAnalizSinifWithPatch() throws Exception {
        // Initialize the database
        denemeAnalizSinifRepository.saveAndFlush(denemeAnalizSinif);

        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();

        // Update the denemeAnalizSinif using partial update
        DenemeAnalizSinif partialUpdatedDenemeAnalizSinif = new DenemeAnalizSinif();
        partialUpdatedDenemeAnalizSinif.setId(denemeAnalizSinif.getId());

        partialUpdatedDenemeAnalizSinif.ortalama(UPDATED_ORTALAMA).konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);

        restDenemeAnalizSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDenemeAnalizSinif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDenemeAnalizSinif))
            )
            .andExpect(status().isOk());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
        DenemeAnalizSinif testDenemeAnalizSinif = denemeAnalizSinifList.get(denemeAnalizSinifList.size() - 1);
        assertThat(testDenemeAnalizSinif.getOrtalama()).isEqualTo(UPDATED_ORTALAMA);
        assertThat(testDenemeAnalizSinif.getKonuAnalizJson()).isEqualTo(UPDATED_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void fullUpdateDenemeAnalizSinifWithPatch() throws Exception {
        // Initialize the database
        denemeAnalizSinifRepository.saveAndFlush(denemeAnalizSinif);

        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();

        // Update the denemeAnalizSinif using partial update
        DenemeAnalizSinif partialUpdatedDenemeAnalizSinif = new DenemeAnalizSinif();
        partialUpdatedDenemeAnalizSinif.setId(denemeAnalizSinif.getId());

        partialUpdatedDenemeAnalizSinif.ortalama(UPDATED_ORTALAMA).konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);

        restDenemeAnalizSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDenemeAnalizSinif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDenemeAnalizSinif))
            )
            .andExpect(status().isOk());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
        DenemeAnalizSinif testDenemeAnalizSinif = denemeAnalizSinifList.get(denemeAnalizSinifList.size() - 1);
        assertThat(testDenemeAnalizSinif.getOrtalama()).isEqualTo(UPDATED_ORTALAMA);
        assertThat(testDenemeAnalizSinif.getKonuAnalizJson()).isEqualTo(UPDATED_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void patchNonExistingDenemeAnalizSinif() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();
        denemeAnalizSinif.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDenemeAnalizSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, denemeAnalizSinif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDenemeAnalizSinif() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();
        denemeAnalizSinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDenemeAnalizSinif() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizSinifRepository.findAll().size();
        denemeAnalizSinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizSinifMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnalizSinif))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DenemeAnalizSinif in the database
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDenemeAnalizSinif() throws Exception {
        // Initialize the database
        denemeAnalizSinifRepository.saveAndFlush(denemeAnalizSinif);

        int databaseSizeBeforeDelete = denemeAnalizSinifRepository.findAll().size();

        // Delete the denemeAnalizSinif
        restDenemeAnalizSinifMockMvc
            .perform(delete(ENTITY_API_URL_ID, denemeAnalizSinif.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DenemeAnalizSinif> denemeAnalizSinifList = denemeAnalizSinifRepository.findAll();
        assertThat(denemeAnalizSinifList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
