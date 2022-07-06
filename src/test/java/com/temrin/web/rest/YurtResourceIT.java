package com.temrin.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.temrin.IntegrationTest;
import com.temrin.domain.Yurt;
import com.temrin.repository.YurtRepository;
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
 * Integration tests for the {@link YurtResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class YurtResourceIT {

    private static final String DEFAULT_ISIM = "AAAAAAAAAA";
    private static final String UPDATED_ISIM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/yurts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private YurtRepository yurtRepository;

    @Mock
    private YurtRepository yurtRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restYurtMockMvc;

    private Yurt yurt;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Yurt createEntity(EntityManager em) {
        Yurt yurt = new Yurt().isim(DEFAULT_ISIM);
        return yurt;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Yurt createUpdatedEntity(EntityManager em) {
        Yurt yurt = new Yurt().isim(UPDATED_ISIM);
        return yurt;
    }

    @BeforeEach
    public void initTest() {
        yurt = createEntity(em);
    }

    @Test
    @Transactional
    void createYurt() throws Exception {
        int databaseSizeBeforeCreate = yurtRepository.findAll().size();
        // Create the Yurt
        restYurtMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(yurt)))
            .andExpect(status().isCreated());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeCreate + 1);
        Yurt testYurt = yurtList.get(yurtList.size() - 1);
        assertThat(testYurt.getIsim()).isEqualTo(DEFAULT_ISIM);
    }

    @Test
    @Transactional
    void createYurtWithExistingId() throws Exception {
        // Create the Yurt with an existing ID
        yurt.setId(1L);

        int databaseSizeBeforeCreate = yurtRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restYurtMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(yurt)))
            .andExpect(status().isBadRequest());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllYurts() throws Exception {
        // Initialize the database
        yurtRepository.saveAndFlush(yurt);

        // Get all the yurtList
        restYurtMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(yurt.getId().intValue())))
            .andExpect(jsonPath("$.[*].isim").value(hasItem(DEFAULT_ISIM)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllYurtsWithEagerRelationshipsIsEnabled() throws Exception {
        when(yurtRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restYurtMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(yurtRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllYurtsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(yurtRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restYurtMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(yurtRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getYurt() throws Exception {
        // Initialize the database
        yurtRepository.saveAndFlush(yurt);

        // Get the yurt
        restYurtMockMvc
            .perform(get(ENTITY_API_URL_ID, yurt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(yurt.getId().intValue()))
            .andExpect(jsonPath("$.isim").value(DEFAULT_ISIM));
    }

    @Test
    @Transactional
    void getNonExistingYurt() throws Exception {
        // Get the yurt
        restYurtMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewYurt() throws Exception {
        // Initialize the database
        yurtRepository.saveAndFlush(yurt);

        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();

        // Update the yurt
        Yurt updatedYurt = yurtRepository.findById(yurt.getId()).get();
        // Disconnect from session so that the updates on updatedYurt are not directly saved in db
        em.detach(updatedYurt);
        updatedYurt.isim(UPDATED_ISIM);

        restYurtMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedYurt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedYurt))
            )
            .andExpect(status().isOk());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
        Yurt testYurt = yurtList.get(yurtList.size() - 1);
        assertThat(testYurt.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void putNonExistingYurt() throws Exception {
        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();
        yurt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restYurtMockMvc
            .perform(
                put(ENTITY_API_URL_ID, yurt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(yurt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchYurt() throws Exception {
        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();
        yurt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYurtMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(yurt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamYurt() throws Exception {
        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();
        yurt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYurtMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(yurt)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateYurtWithPatch() throws Exception {
        // Initialize the database
        yurtRepository.saveAndFlush(yurt);

        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();

        // Update the yurt using partial update
        Yurt partialUpdatedYurt = new Yurt();
        partialUpdatedYurt.setId(yurt.getId());

        partialUpdatedYurt.isim(UPDATED_ISIM);

        restYurtMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedYurt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedYurt))
            )
            .andExpect(status().isOk());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
        Yurt testYurt = yurtList.get(yurtList.size() - 1);
        assertThat(testYurt.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void fullUpdateYurtWithPatch() throws Exception {
        // Initialize the database
        yurtRepository.saveAndFlush(yurt);

        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();

        // Update the yurt using partial update
        Yurt partialUpdatedYurt = new Yurt();
        partialUpdatedYurt.setId(yurt.getId());

        partialUpdatedYurt.isim(UPDATED_ISIM);

        restYurtMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedYurt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedYurt))
            )
            .andExpect(status().isOk());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
        Yurt testYurt = yurtList.get(yurtList.size() - 1);
        assertThat(testYurt.getIsim()).isEqualTo(UPDATED_ISIM);
    }

    @Test
    @Transactional
    void patchNonExistingYurt() throws Exception {
        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();
        yurt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restYurtMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, yurt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(yurt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchYurt() throws Exception {
        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();
        yurt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYurtMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(yurt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamYurt() throws Exception {
        int databaseSizeBeforeUpdate = yurtRepository.findAll().size();
        yurt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYurtMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(yurt)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Yurt in the database
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteYurt() throws Exception {
        // Initialize the database
        yurtRepository.saveAndFlush(yurt);

        int databaseSizeBeforeDelete = yurtRepository.findAll().size();

        // Delete the yurt
        restYurtMockMvc
            .perform(delete(ENTITY_API_URL_ID, yurt.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Yurt> yurtList = yurtRepository.findAll();
        assertThat(yurtList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
