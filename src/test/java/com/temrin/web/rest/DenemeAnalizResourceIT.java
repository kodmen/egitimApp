package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.DenemeAnaliz;
import com.temrin.repository.DenemeAnalizRepository;
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
 * Integration tests for the {@link DenemeAnalizResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DenemeAnalizResourceIT {

    private static final Integer DEFAULT_DOGRU = 1;
    private static final Integer UPDATED_DOGRU = 2;

    private static final Integer DEFAULT_YANLIS = 1;
    private static final Integer UPDATED_YANLIS = 2;

    private static final Integer DEFAULT_PUAN = 1;
    private static final Integer UPDATED_PUAN = 2;

    private static final Boolean DEFAULT_COZULDU = false;
    private static final Boolean UPDATED_COZULDU = true;

    private static final String DEFAULT_KONU_ANALIZ_JSON = "AAAAAAAAAA";
    private static final String UPDATED_KONU_ANALIZ_JSON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/deneme-analizs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DenemeAnalizRepository denemeAnalizRepository;

    @Mock
    private DenemeAnalizRepository denemeAnalizRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDenemeAnalizMockMvc;

    private DenemeAnaliz denemeAnaliz;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DenemeAnaliz createEntity(EntityManager em) {
        DenemeAnaliz denemeAnaliz = new DenemeAnaliz()
            .dogru(DEFAULT_DOGRU)
            .yanlis(DEFAULT_YANLIS)
            .puan(DEFAULT_PUAN)
            .cozuldu(DEFAULT_COZULDU)
            .konuAnalizJson(DEFAULT_KONU_ANALIZ_JSON);
        return denemeAnaliz;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DenemeAnaliz createUpdatedEntity(EntityManager em) {
        DenemeAnaliz denemeAnaliz = new DenemeAnaliz()
            .dogru(UPDATED_DOGRU)
            .yanlis(UPDATED_YANLIS)
            .puan(UPDATED_PUAN)
            .cozuldu(UPDATED_COZULDU)
            .konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);
        return denemeAnaliz;
    }

    @BeforeEach
    public void initTest() {
        denemeAnaliz = createEntity(em);
    }

    @Test
    @Transactional
    void createDenemeAnaliz() throws Exception {
        int databaseSizeBeforeCreate = denemeAnalizRepository.findAll().size();
        // Create the DenemeAnaliz
        restDenemeAnalizMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(denemeAnaliz)))
            .andExpect(status().isCreated());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeCreate + 1);
        DenemeAnaliz testDenemeAnaliz = denemeAnalizList.get(denemeAnalizList.size() - 1);
        assertThat(testDenemeAnaliz.getDogru()).isEqualTo(DEFAULT_DOGRU);
        assertThat(testDenemeAnaliz.getYanlis()).isEqualTo(DEFAULT_YANLIS);
        assertThat(testDenemeAnaliz.getPuan()).isEqualTo(DEFAULT_PUAN);
        assertThat(testDenemeAnaliz.getCozuldu()).isEqualTo(DEFAULT_COZULDU);
        assertThat(testDenemeAnaliz.getKonuAnalizJson()).isEqualTo(DEFAULT_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void createDenemeAnalizWithExistingId() throws Exception {
        // Create the DenemeAnaliz with an existing ID
        denemeAnaliz.setId(1L);

        int databaseSizeBeforeCreate = denemeAnalizRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDenemeAnalizMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(denemeAnaliz)))
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDenemeAnalizs() throws Exception {
        // Initialize the database
        denemeAnalizRepository.saveAndFlush(denemeAnaliz);

        // Get all the denemeAnalizList
        restDenemeAnalizMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(denemeAnaliz.getId().intValue())))
            .andExpect(jsonPath("$.[*].dogru").value(hasItem(DEFAULT_DOGRU)))
            .andExpect(jsonPath("$.[*].yanlis").value(hasItem(DEFAULT_YANLIS)))
            .andExpect(jsonPath("$.[*].puan").value(hasItem(DEFAULT_PUAN)))
            .andExpect(jsonPath("$.[*].cozuldu").value(hasItem(DEFAULT_COZULDU.booleanValue())))
            .andExpect(jsonPath("$.[*].konuAnalizJson").value(hasItem(DEFAULT_KONU_ANALIZ_JSON)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDenemeAnalizsWithEagerRelationshipsIsEnabled() throws Exception {
        when(denemeAnalizRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDenemeAnalizMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(denemeAnalizRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDenemeAnalizsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(denemeAnalizRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDenemeAnalizMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(denemeAnalizRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getDenemeAnaliz() throws Exception {
        // Initialize the database
        denemeAnalizRepository.saveAndFlush(denemeAnaliz);

        // Get the denemeAnaliz
        restDenemeAnalizMockMvc
            .perform(get(ENTITY_API_URL_ID, denemeAnaliz.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(denemeAnaliz.getId().intValue()))
            .andExpect(jsonPath("$.dogru").value(DEFAULT_DOGRU))
            .andExpect(jsonPath("$.yanlis").value(DEFAULT_YANLIS))
            .andExpect(jsonPath("$.puan").value(DEFAULT_PUAN))
            .andExpect(jsonPath("$.cozuldu").value(DEFAULT_COZULDU.booleanValue()))
            .andExpect(jsonPath("$.konuAnalizJson").value(DEFAULT_KONU_ANALIZ_JSON));
    }

    @Test
    @Transactional
    void getNonExistingDenemeAnaliz() throws Exception {
        // Get the denemeAnaliz
        restDenemeAnalizMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDenemeAnaliz() throws Exception {
        // Initialize the database
        denemeAnalizRepository.saveAndFlush(denemeAnaliz);

        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();

        // Update the denemeAnaliz
        DenemeAnaliz updatedDenemeAnaliz = denemeAnalizRepository.findById(denemeAnaliz.getId()).get();
        // Disconnect from session so that the updates on updatedDenemeAnaliz are not directly saved in db
        em.detach(updatedDenemeAnaliz);
        updatedDenemeAnaliz
            .dogru(UPDATED_DOGRU)
            .yanlis(UPDATED_YANLIS)
            .puan(UPDATED_PUAN)
            .cozuldu(UPDATED_COZULDU)
            .konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);

        restDenemeAnalizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDenemeAnaliz.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDenemeAnaliz))
            )
            .andExpect(status().isOk());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
        DenemeAnaliz testDenemeAnaliz = denemeAnalizList.get(denemeAnalizList.size() - 1);
        assertThat(testDenemeAnaliz.getDogru()).isEqualTo(UPDATED_DOGRU);
        assertThat(testDenemeAnaliz.getYanlis()).isEqualTo(UPDATED_YANLIS);
        assertThat(testDenemeAnaliz.getPuan()).isEqualTo(UPDATED_PUAN);
        assertThat(testDenemeAnaliz.getCozuldu()).isEqualTo(UPDATED_COZULDU);
        assertThat(testDenemeAnaliz.getKonuAnalizJson()).isEqualTo(UPDATED_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void putNonExistingDenemeAnaliz() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();
        denemeAnaliz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDenemeAnalizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, denemeAnaliz.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnaliz))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDenemeAnaliz() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();
        denemeAnaliz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnaliz))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDenemeAnaliz() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();
        denemeAnaliz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(denemeAnaliz)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDenemeAnalizWithPatch() throws Exception {
        // Initialize the database
        denemeAnalizRepository.saveAndFlush(denemeAnaliz);

        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();

        // Update the denemeAnaliz using partial update
        DenemeAnaliz partialUpdatedDenemeAnaliz = new DenemeAnaliz();
        partialUpdatedDenemeAnaliz.setId(denemeAnaliz.getId());

        partialUpdatedDenemeAnaliz.dogru(UPDATED_DOGRU).puan(UPDATED_PUAN).konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);

        restDenemeAnalizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDenemeAnaliz.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDenemeAnaliz))
            )
            .andExpect(status().isOk());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
        DenemeAnaliz testDenemeAnaliz = denemeAnalizList.get(denemeAnalizList.size() - 1);
        assertThat(testDenemeAnaliz.getDogru()).isEqualTo(UPDATED_DOGRU);
        assertThat(testDenemeAnaliz.getYanlis()).isEqualTo(DEFAULT_YANLIS);
        assertThat(testDenemeAnaliz.getPuan()).isEqualTo(UPDATED_PUAN);
        assertThat(testDenemeAnaliz.getCozuldu()).isEqualTo(DEFAULT_COZULDU);
        assertThat(testDenemeAnaliz.getKonuAnalizJson()).isEqualTo(UPDATED_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void fullUpdateDenemeAnalizWithPatch() throws Exception {
        // Initialize the database
        denemeAnalizRepository.saveAndFlush(denemeAnaliz);

        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();

        // Update the denemeAnaliz using partial update
        DenemeAnaliz partialUpdatedDenemeAnaliz = new DenemeAnaliz();
        partialUpdatedDenemeAnaliz.setId(denemeAnaliz.getId());

        partialUpdatedDenemeAnaliz
            .dogru(UPDATED_DOGRU)
            .yanlis(UPDATED_YANLIS)
            .puan(UPDATED_PUAN)
            .cozuldu(UPDATED_COZULDU)
            .konuAnalizJson(UPDATED_KONU_ANALIZ_JSON);

        restDenemeAnalizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDenemeAnaliz.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDenemeAnaliz))
            )
            .andExpect(status().isOk());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
        DenemeAnaliz testDenemeAnaliz = denemeAnalizList.get(denemeAnalizList.size() - 1);
        assertThat(testDenemeAnaliz.getDogru()).isEqualTo(UPDATED_DOGRU);
        assertThat(testDenemeAnaliz.getYanlis()).isEqualTo(UPDATED_YANLIS);
        assertThat(testDenemeAnaliz.getPuan()).isEqualTo(UPDATED_PUAN);
        assertThat(testDenemeAnaliz.getCozuldu()).isEqualTo(UPDATED_COZULDU);
        assertThat(testDenemeAnaliz.getKonuAnalizJson()).isEqualTo(UPDATED_KONU_ANALIZ_JSON);
    }

    @Test
    @Transactional
    void patchNonExistingDenemeAnaliz() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();
        denemeAnaliz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDenemeAnalizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, denemeAnaliz.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnaliz))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDenemeAnaliz() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();
        denemeAnaliz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(denemeAnaliz))
            )
            .andExpect(status().isBadRequest());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDenemeAnaliz() throws Exception {
        int databaseSizeBeforeUpdate = denemeAnalizRepository.findAll().size();
        denemeAnaliz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeAnalizMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(denemeAnaliz))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DenemeAnaliz in the database
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDenemeAnaliz() throws Exception {
        // Initialize the database
        denemeAnalizRepository.saveAndFlush(denemeAnaliz);

        int databaseSizeBeforeDelete = denemeAnalizRepository.findAll().size();

        // Delete the denemeAnaliz
        restDenemeAnalizMockMvc
            .perform(delete(ENTITY_API_URL_ID, denemeAnaliz.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DenemeAnaliz> denemeAnalizList = denemeAnalizRepository.findAll();
        assertThat(denemeAnalizList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
