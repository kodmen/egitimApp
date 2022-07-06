package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.Deneme;
import com.temrin.repository.DenemeRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link DenemeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DenemeResourceIT {

    private static final String DEFAULT_ISIM = "AAAAAAAAAA";
    private static final String UPDATED_ISIM = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_OLUSTURMA_TARIH = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_OLUSTURMA_TARIH = LocalDate.now(ZoneId.systemDefault());

    private static final Instant DEFAULT_BASLAMA_TARIH = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_BASLAMA_TARIH = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_SURE = 1;
    private static final Integer UPDATED_SURE = 2;

    private static final String DEFAULT_CEVAP_ANAHTAR = "AAAAAAAAAA";
    private static final String UPDATED_CEVAP_ANAHTAR = "BBBBBBBBBB";

    private static final String DEFAULT_DENEME_INFO_JSON = "AAAAAAAAAA";
    private static final String UPDATED_DENEME_INFO_JSON = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/denemes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DenemeRepository denemeRepository;

    @Mock
    private DenemeRepository denemeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDenemeMockMvc;

    private Deneme deneme;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Deneme createEntity(EntityManager em) {
        Deneme deneme = new Deneme()
            .isim(DEFAULT_ISIM)
            .olusturmaTarih(DEFAULT_OLUSTURMA_TARIH)
            .baslamaTarih(DEFAULT_BASLAMA_TARIH)
            .sure(DEFAULT_SURE)
            .cevapAnahtar(DEFAULT_CEVAP_ANAHTAR)
            .denemeInfoJson(DEFAULT_DENEME_INFO_JSON);
        return deneme;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Deneme createUpdatedEntity(EntityManager em) {
        Deneme deneme = new Deneme()
            .isim(UPDATED_ISIM)
            .olusturmaTarih(UPDATED_OLUSTURMA_TARIH)
            .baslamaTarih(UPDATED_BASLAMA_TARIH)
            .sure(UPDATED_SURE)
            .cevapAnahtar(UPDATED_CEVAP_ANAHTAR)
            .denemeInfoJson(UPDATED_DENEME_INFO_JSON);
        return deneme;
    }

    @BeforeEach
    public void initTest() {
        deneme = createEntity(em);
    }

    @Test
    @Transactional
    void createDeneme() throws Exception {
        int databaseSizeBeforeCreate = denemeRepository.findAll().size();
        // Create the Deneme
        restDenemeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deneme)))
            .andExpect(status().isCreated());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeCreate + 1);
        Deneme testDeneme = denemeList.get(denemeList.size() - 1);
        assertThat(testDeneme.getIsim()).isEqualTo(DEFAULT_ISIM);
        assertThat(testDeneme.getOlusturmaTarih()).isEqualTo(DEFAULT_OLUSTURMA_TARIH);
        assertThat(testDeneme.getBaslamaTarih()).isEqualTo(DEFAULT_BASLAMA_TARIH);
        assertThat(testDeneme.getSure()).isEqualTo(DEFAULT_SURE);
        assertThat(testDeneme.getCevapAnahtar()).isEqualTo(DEFAULT_CEVAP_ANAHTAR);
        assertThat(testDeneme.getDenemeInfoJson()).isEqualTo(DEFAULT_DENEME_INFO_JSON);
    }

    @Test
    @Transactional
    void createDenemeWithExistingId() throws Exception {
        // Create the Deneme with an existing ID
        deneme.setId(1L);

        int databaseSizeBeforeCreate = denemeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDenemeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deneme)))
            .andExpect(status().isBadRequest());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDenemes() throws Exception {
        // Initialize the database
        denemeRepository.saveAndFlush(deneme);

        // Get all the denemeList
        restDenemeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deneme.getId().intValue())))
            .andExpect(jsonPath("$.[*].isim").value(hasItem(DEFAULT_ISIM)))
            .andExpect(jsonPath("$.[*].olusturmaTarih").value(hasItem(DEFAULT_OLUSTURMA_TARIH.toString())))
            .andExpect(jsonPath("$.[*].baslamaTarih").value(hasItem(DEFAULT_BASLAMA_TARIH.toString())))
            .andExpect(jsonPath("$.[*].sure").value(hasItem(DEFAULT_SURE)))
            .andExpect(jsonPath("$.[*].cevapAnahtar").value(hasItem(DEFAULT_CEVAP_ANAHTAR)))
            .andExpect(jsonPath("$.[*].denemeInfoJson").value(hasItem(DEFAULT_DENEME_INFO_JSON)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDenemesWithEagerRelationshipsIsEnabled() throws Exception {
        when(denemeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDenemeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(denemeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDenemesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(denemeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDenemeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(denemeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getDeneme() throws Exception {
        // Initialize the database
        denemeRepository.saveAndFlush(deneme);

        // Get the deneme
        restDenemeMockMvc
            .perform(get(ENTITY_API_URL_ID, deneme.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(deneme.getId().intValue()))
            .andExpect(jsonPath("$.isim").value(DEFAULT_ISIM))
            .andExpect(jsonPath("$.olusturmaTarih").value(DEFAULT_OLUSTURMA_TARIH.toString()))
            .andExpect(jsonPath("$.baslamaTarih").value(DEFAULT_BASLAMA_TARIH.toString()))
            .andExpect(jsonPath("$.sure").value(DEFAULT_SURE))
            .andExpect(jsonPath("$.cevapAnahtar").value(DEFAULT_CEVAP_ANAHTAR))
            .andExpect(jsonPath("$.denemeInfoJson").value(DEFAULT_DENEME_INFO_JSON));
    }

    @Test
    @Transactional
    void getNonExistingDeneme() throws Exception {
        // Get the deneme
        restDenemeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDeneme() throws Exception {
        // Initialize the database
        denemeRepository.saveAndFlush(deneme);

        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();

        // Update the deneme
        Deneme updatedDeneme = denemeRepository.findById(deneme.getId()).get();
        // Disconnect from session so that the updates on updatedDeneme are not directly saved in db
        em.detach(updatedDeneme);
        updatedDeneme
            .isim(UPDATED_ISIM)
            .olusturmaTarih(UPDATED_OLUSTURMA_TARIH)
            .baslamaTarih(UPDATED_BASLAMA_TARIH)
            .sure(UPDATED_SURE)
            .cevapAnahtar(UPDATED_CEVAP_ANAHTAR)
            .denemeInfoJson(UPDATED_DENEME_INFO_JSON);

        restDenemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDeneme.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDeneme))
            )
            .andExpect(status().isOk());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
        Deneme testDeneme = denemeList.get(denemeList.size() - 1);
        assertThat(testDeneme.getIsim()).isEqualTo(UPDATED_ISIM);
        assertThat(testDeneme.getOlusturmaTarih()).isEqualTo(UPDATED_OLUSTURMA_TARIH);
        assertThat(testDeneme.getBaslamaTarih()).isEqualTo(UPDATED_BASLAMA_TARIH);
        assertThat(testDeneme.getSure()).isEqualTo(UPDATED_SURE);
        assertThat(testDeneme.getCevapAnahtar()).isEqualTo(UPDATED_CEVAP_ANAHTAR);
        assertThat(testDeneme.getDenemeInfoJson()).isEqualTo(UPDATED_DENEME_INFO_JSON);
    }

    @Test
    @Transactional
    void putNonExistingDeneme() throws Exception {
        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();
        deneme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDenemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deneme.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deneme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDeneme() throws Exception {
        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();
        deneme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deneme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDeneme() throws Exception {
        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();
        deneme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(deneme)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDenemeWithPatch() throws Exception {
        // Initialize the database
        denemeRepository.saveAndFlush(deneme);

        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();

        // Update the deneme using partial update
        Deneme partialUpdatedDeneme = new Deneme();
        partialUpdatedDeneme.setId(deneme.getId());

        partialUpdatedDeneme
            .olusturmaTarih(UPDATED_OLUSTURMA_TARIH)
            .baslamaTarih(UPDATED_BASLAMA_TARIH)
            .sure(UPDATED_SURE)
            .denemeInfoJson(UPDATED_DENEME_INFO_JSON);

        restDenemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeneme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeneme))
            )
            .andExpect(status().isOk());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
        Deneme testDeneme = denemeList.get(denemeList.size() - 1);
        assertThat(testDeneme.getIsim()).isEqualTo(DEFAULT_ISIM);
        assertThat(testDeneme.getOlusturmaTarih()).isEqualTo(UPDATED_OLUSTURMA_TARIH);
        assertThat(testDeneme.getBaslamaTarih()).isEqualTo(UPDATED_BASLAMA_TARIH);
        assertThat(testDeneme.getSure()).isEqualTo(UPDATED_SURE);
        assertThat(testDeneme.getCevapAnahtar()).isEqualTo(DEFAULT_CEVAP_ANAHTAR);
        assertThat(testDeneme.getDenemeInfoJson()).isEqualTo(UPDATED_DENEME_INFO_JSON);
    }

    @Test
    @Transactional
    void fullUpdateDenemeWithPatch() throws Exception {
        // Initialize the database
        denemeRepository.saveAndFlush(deneme);

        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();

        // Update the deneme using partial update
        Deneme partialUpdatedDeneme = new Deneme();
        partialUpdatedDeneme.setId(deneme.getId());

        partialUpdatedDeneme
            .isim(UPDATED_ISIM)
            .olusturmaTarih(UPDATED_OLUSTURMA_TARIH)
            .baslamaTarih(UPDATED_BASLAMA_TARIH)
            .sure(UPDATED_SURE)
            .cevapAnahtar(UPDATED_CEVAP_ANAHTAR)
            .denemeInfoJson(UPDATED_DENEME_INFO_JSON);

        restDenemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeneme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeneme))
            )
            .andExpect(status().isOk());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
        Deneme testDeneme = denemeList.get(denemeList.size() - 1);
        assertThat(testDeneme.getIsim()).isEqualTo(UPDATED_ISIM);
        assertThat(testDeneme.getOlusturmaTarih()).isEqualTo(UPDATED_OLUSTURMA_TARIH);
        assertThat(testDeneme.getBaslamaTarih()).isEqualTo(UPDATED_BASLAMA_TARIH);
        assertThat(testDeneme.getSure()).isEqualTo(UPDATED_SURE);
        assertThat(testDeneme.getCevapAnahtar()).isEqualTo(UPDATED_CEVAP_ANAHTAR);
        assertThat(testDeneme.getDenemeInfoJson()).isEqualTo(UPDATED_DENEME_INFO_JSON);
    }

    @Test
    @Transactional
    void patchNonExistingDeneme() throws Exception {
        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();
        deneme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDenemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, deneme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deneme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDeneme() throws Exception {
        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();
        deneme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deneme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDeneme() throws Exception {
        int databaseSizeBeforeUpdate = denemeRepository.findAll().size();
        deneme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDenemeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(deneme)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Deneme in the database
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDeneme() throws Exception {
        // Initialize the database
        denemeRepository.saveAndFlush(deneme);

        int databaseSizeBeforeDelete = denemeRepository.findAll().size();

        // Delete the deneme
        restDenemeMockMvc
            .perform(delete(ENTITY_API_URL_ID, deneme.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Deneme> denemeList = denemeRepository.findAll();
        assertThat(denemeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
