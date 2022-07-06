package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.Sinif;
import com.temrin.repository.SinifRepository;
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
 * Integration tests for the {@link SinifResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SinifResourceIT {

    private static final String DEFAULT_ISIM = "AAAAAAAAAA";
    private static final String UPDATED_ISIM = "BBBBBBBBBB";

    private static final String DEFAULT_KONULIMIZJSON = "AAAAAAAAAA";
    private static final String UPDATED_KONULIMIZJSON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sinifs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SinifRepository sinifRepository;

    @Mock
    private SinifRepository sinifRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSinifMockMvc;

    private Sinif sinif;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sinif createEntity(EntityManager em) {
        Sinif sinif = new Sinif().isim(DEFAULT_ISIM).konulimizjson(DEFAULT_KONULIMIZJSON);
        return sinif;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sinif createUpdatedEntity(EntityManager em) {
        Sinif sinif = new Sinif().isim(UPDATED_ISIM).konulimizjson(UPDATED_KONULIMIZJSON);
        return sinif;
    }

    @BeforeEach
    public void initTest() {
        sinif = createEntity(em);
    }

    @Test
    @Transactional
    void createSinif() throws Exception {
        int databaseSizeBeforeCreate = sinifRepository.findAll().size();
        // Create the Sinif
        restSinifMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sinif)))
            .andExpect(status().isCreated());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeCreate + 1);
        Sinif testSinif = sinifList.get(sinifList.size() - 1);
        assertThat(testSinif.getIsim()).isEqualTo(DEFAULT_ISIM);
        assertThat(testSinif.getKonulimizjson()).isEqualTo(DEFAULT_KONULIMIZJSON);
    }

    @Test
    @Transactional
    void createSinifWithExistingId() throws Exception {
        // Create the Sinif with an existing ID
        sinif.setId(1L);

        int databaseSizeBeforeCreate = sinifRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSinifMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sinif)))
            .andExpect(status().isBadRequest());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSinifs() throws Exception {
        // Initialize the database
        sinifRepository.saveAndFlush(sinif);

        // Get all the sinifList
        restSinifMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sinif.getId().intValue())))
            .andExpect(jsonPath("$.[*].isim").value(hasItem(DEFAULT_ISIM)))
            .andExpect(jsonPath("$.[*].konulimizjson").value(hasItem(DEFAULT_KONULIMIZJSON)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSinifsWithEagerRelationshipsIsEnabled() throws Exception {
        when(sinifRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSinifMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(sinifRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSinifsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(sinifRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSinifMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(sinifRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getSinif() throws Exception {
        // Initialize the database
        sinifRepository.saveAndFlush(sinif);

        // Get the sinif
        restSinifMockMvc
            .perform(get(ENTITY_API_URL_ID, sinif.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sinif.getId().intValue()))
            .andExpect(jsonPath("$.isim").value(DEFAULT_ISIM))
            .andExpect(jsonPath("$.konulimizjson").value(DEFAULT_KONULIMIZJSON));
    }

    @Test
    @Transactional
    void getNonExistingSinif() throws Exception {
        // Get the sinif
        restSinifMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSinif() throws Exception {
        // Initialize the database
        sinifRepository.saveAndFlush(sinif);

        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();

        // Update the sinif
        Sinif updatedSinif = sinifRepository.findById(sinif.getId()).get();
        // Disconnect from session so that the updates on updatedSinif are not directly saved in db
        em.detach(updatedSinif);
        updatedSinif.isim(UPDATED_ISIM).konulimizjson(UPDATED_KONULIMIZJSON);

        restSinifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSinif.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSinif))
            )
            .andExpect(status().isOk());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
        Sinif testSinif = sinifList.get(sinifList.size() - 1);
        assertThat(testSinif.getIsim()).isEqualTo(UPDATED_ISIM);
        assertThat(testSinif.getKonulimizjson()).isEqualTo(UPDATED_KONULIMIZJSON);
    }

    @Test
    @Transactional
    void putNonExistingSinif() throws Exception {
        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();
        sinif.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSinifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sinif.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSinif() throws Exception {
        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();
        sinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSinifMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSinif() throws Exception {
        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();
        sinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSinifMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sinif)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSinifWithPatch() throws Exception {
        // Initialize the database
        sinifRepository.saveAndFlush(sinif);

        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();

        // Update the sinif using partial update
        Sinif partialUpdatedSinif = new Sinif();
        partialUpdatedSinif.setId(sinif.getId());

        partialUpdatedSinif.konulimizjson(UPDATED_KONULIMIZJSON);

        restSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSinif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSinif))
            )
            .andExpect(status().isOk());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
        Sinif testSinif = sinifList.get(sinifList.size() - 1);
        assertThat(testSinif.getIsim()).isEqualTo(DEFAULT_ISIM);
        assertThat(testSinif.getKonulimizjson()).isEqualTo(UPDATED_KONULIMIZJSON);
    }

    @Test
    @Transactional
    void fullUpdateSinifWithPatch() throws Exception {
        // Initialize the database
        sinifRepository.saveAndFlush(sinif);

        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();

        // Update the sinif using partial update
        Sinif partialUpdatedSinif = new Sinif();
        partialUpdatedSinif.setId(sinif.getId());

        partialUpdatedSinif.isim(UPDATED_ISIM).konulimizjson(UPDATED_KONULIMIZJSON);

        restSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSinif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSinif))
            )
            .andExpect(status().isOk());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
        Sinif testSinif = sinifList.get(sinifList.size() - 1);
        assertThat(testSinif.getIsim()).isEqualTo(UPDATED_ISIM);
        assertThat(testSinif.getKonulimizjson()).isEqualTo(UPDATED_KONULIMIZJSON);
    }

    @Test
    @Transactional
    void patchNonExistingSinif() throws Exception {
        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();
        sinif.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sinif.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSinif() throws Exception {
        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();
        sinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSinifMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sinif))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSinif() throws Exception {
        int databaseSizeBeforeUpdate = sinifRepository.findAll().size();
        sinif.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSinifMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sinif)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sinif in the database
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSinif() throws Exception {
        // Initialize the database
        sinifRepository.saveAndFlush(sinif);

        int databaseSizeBeforeDelete = sinifRepository.findAll().size();

        // Delete the sinif
        restSinifMockMvc
            .perform(delete(ENTITY_API_URL_ID, sinif.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sinif> sinifList = sinifRepository.findAll();
        assertThat(sinifList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
