package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.Soru;
import com.temrin.repository.SoruRepository;
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
 * Integration tests for the {@link SoruResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SoruResourceIT {

    private static final String DEFAULT_ISIM = "AAAAAAAAAA";
    private static final String UPDATED_ISIM = "BBBBBBBBBB";

    private static final String DEFAULT_CEVAP = "AAAAAAAAAA";
    private static final String UPDATED_CEVAP = "BBBBBBBBBB";

    private static final Integer DEFAULT_SIRA = 1;
    private static final Integer UPDATED_SIRA = 2;

    private static final String DEFAULT_RESIM_URL = "AAAAAAAAAA";
    private static final String UPDATED_RESIM_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sorus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SoruRepository soruRepository;

    @Mock
    private SoruRepository soruRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSoruMockMvc;

    private Soru soru;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Soru createEntity(EntityManager em) {
        Soru soru = new Soru().isim(DEFAULT_ISIM).cevap(DEFAULT_CEVAP).sira(DEFAULT_SIRA).resimUrl(DEFAULT_RESIM_URL);
        return soru;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Soru createUpdatedEntity(EntityManager em) {
        Soru soru = new Soru().isim(UPDATED_ISIM).cevap(UPDATED_CEVAP).sira(UPDATED_SIRA).resimUrl(UPDATED_RESIM_URL);
        return soru;
    }

    @BeforeEach
    public void initTest() {
        soru = createEntity(em);
    }

    @Test
    @Transactional
    void createSoru() throws Exception {
        int databaseSizeBeforeCreate = soruRepository.findAll().size();
        // Create the Soru
        restSoruMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soru)))
            .andExpect(status().isCreated());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeCreate + 1);
        Soru testSoru = soruList.get(soruList.size() - 1);
        assertThat(testSoru.getIsim()).isEqualTo(DEFAULT_ISIM);
        assertThat(testSoru.getCevap()).isEqualTo(DEFAULT_CEVAP);
        assertThat(testSoru.getSira()).isEqualTo(DEFAULT_SIRA);
        assertThat(testSoru.getResimUrl()).isEqualTo(DEFAULT_RESIM_URL);
    }

    @Test
    @Transactional
    void createSoruWithExistingId() throws Exception {
        // Create the Soru with an existing ID
        soru.setId(1L);

        int databaseSizeBeforeCreate = soruRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSoruMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soru)))
            .andExpect(status().isBadRequest());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSorus() throws Exception {
        // Initialize the database
        soruRepository.saveAndFlush(soru);

        // Get all the soruList
        restSoruMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(soru.getId().intValue())))
            .andExpect(jsonPath("$.[*].isim").value(hasItem(DEFAULT_ISIM)))
            .andExpect(jsonPath("$.[*].cevap").value(hasItem(DEFAULT_CEVAP)))
            .andExpect(jsonPath("$.[*].sira").value(hasItem(DEFAULT_SIRA)))
            .andExpect(jsonPath("$.[*].resimUrl").value(hasItem(DEFAULT_RESIM_URL)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSorusWithEagerRelationshipsIsEnabled() throws Exception {
        when(soruRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSoruMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(soruRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSorusWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(soruRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSoruMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(soruRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getSoru() throws Exception {
        // Initialize the database
        soruRepository.saveAndFlush(soru);

        // Get the soru
        restSoruMockMvc
            .perform(get(ENTITY_API_URL_ID, soru.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(soru.getId().intValue()))
            .andExpect(jsonPath("$.isim").value(DEFAULT_ISIM))
            .andExpect(jsonPath("$.cevap").value(DEFAULT_CEVAP))
            .andExpect(jsonPath("$.sira").value(DEFAULT_SIRA))
            .andExpect(jsonPath("$.resimUrl").value(DEFAULT_RESIM_URL));
    }

    @Test
    @Transactional
    void getNonExistingSoru() throws Exception {
        // Get the soru
        restSoruMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSoru() throws Exception {
        // Initialize the database
        soruRepository.saveAndFlush(soru);

        int databaseSizeBeforeUpdate = soruRepository.findAll().size();

        // Update the soru
        Soru updatedSoru = soruRepository.findById(soru.getId()).get();
        // Disconnect from session so that the updates on updatedSoru are not directly saved in db
        em.detach(updatedSoru);
        updatedSoru.isim(UPDATED_ISIM).cevap(UPDATED_CEVAP).sira(UPDATED_SIRA).resimUrl(UPDATED_RESIM_URL);

        restSoruMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSoru.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSoru))
            )
            .andExpect(status().isOk());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
        Soru testSoru = soruList.get(soruList.size() - 1);
        assertThat(testSoru.getIsim()).isEqualTo(UPDATED_ISIM);
        assertThat(testSoru.getCevap()).isEqualTo(UPDATED_CEVAP);
        assertThat(testSoru.getSira()).isEqualTo(UPDATED_SIRA);
        assertThat(testSoru.getResimUrl()).isEqualTo(UPDATED_RESIM_URL);
    }

    @Test
    @Transactional
    void putNonExistingSoru() throws Exception {
        int databaseSizeBeforeUpdate = soruRepository.findAll().size();
        soru.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSoruMockMvc
            .perform(
                put(ENTITY_API_URL_ID, soru.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(soru))
            )
            .andExpect(status().isBadRequest());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSoru() throws Exception {
        int databaseSizeBeforeUpdate = soruRepository.findAll().size();
        soru.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoruMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(soru))
            )
            .andExpect(status().isBadRequest());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSoru() throws Exception {
        int databaseSizeBeforeUpdate = soruRepository.findAll().size();
        soru.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoruMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(soru)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSoruWithPatch() throws Exception {
        // Initialize the database
        soruRepository.saveAndFlush(soru);

        int databaseSizeBeforeUpdate = soruRepository.findAll().size();

        // Update the soru using partial update
        Soru partialUpdatedSoru = new Soru();
        partialUpdatedSoru.setId(soru.getId());

        partialUpdatedSoru.isim(UPDATED_ISIM).sira(UPDATED_SIRA).resimUrl(UPDATED_RESIM_URL);

        restSoruMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSoru.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSoru))
            )
            .andExpect(status().isOk());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
        Soru testSoru = soruList.get(soruList.size() - 1);
        assertThat(testSoru.getIsim()).isEqualTo(UPDATED_ISIM);
        assertThat(testSoru.getCevap()).isEqualTo(DEFAULT_CEVAP);
        assertThat(testSoru.getSira()).isEqualTo(UPDATED_SIRA);
        assertThat(testSoru.getResimUrl()).isEqualTo(UPDATED_RESIM_URL);
    }

    @Test
    @Transactional
    void fullUpdateSoruWithPatch() throws Exception {
        // Initialize the database
        soruRepository.saveAndFlush(soru);

        int databaseSizeBeforeUpdate = soruRepository.findAll().size();

        // Update the soru using partial update
        Soru partialUpdatedSoru = new Soru();
        partialUpdatedSoru.setId(soru.getId());

        partialUpdatedSoru.isim(UPDATED_ISIM).cevap(UPDATED_CEVAP).sira(UPDATED_SIRA).resimUrl(UPDATED_RESIM_URL);

        restSoruMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSoru.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSoru))
            )
            .andExpect(status().isOk());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
        Soru testSoru = soruList.get(soruList.size() - 1);
        assertThat(testSoru.getIsim()).isEqualTo(UPDATED_ISIM);
        assertThat(testSoru.getCevap()).isEqualTo(UPDATED_CEVAP);
        assertThat(testSoru.getSira()).isEqualTo(UPDATED_SIRA);
        assertThat(testSoru.getResimUrl()).isEqualTo(UPDATED_RESIM_URL);
    }

    @Test
    @Transactional
    void patchNonExistingSoru() throws Exception {
        int databaseSizeBeforeUpdate = soruRepository.findAll().size();
        soru.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSoruMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, soru.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(soru))
            )
            .andExpect(status().isBadRequest());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSoru() throws Exception {
        int databaseSizeBeforeUpdate = soruRepository.findAll().size();
        soru.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoruMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(soru))
            )
            .andExpect(status().isBadRequest());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSoru() throws Exception {
        int databaseSizeBeforeUpdate = soruRepository.findAll().size();
        soru.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSoruMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(soru)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Soru in the database
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSoru() throws Exception {
        // Initialize the database
        soruRepository.saveAndFlush(soru);

        int databaseSizeBeforeDelete = soruRepository.findAll().size();

        // Delete the soru
        restSoruMockMvc
            .perform(delete(ENTITY_API_URL_ID, soru.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Soru> soruList = soruRepository.findAll();
        assertThat(soruList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
