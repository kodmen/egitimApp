package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SoruTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Soru.class);
        Soru soru1 = new Soru();
        soru1.setId(1L);
        Soru soru2 = new Soru();
        soru2.setId(soru1.getId());
        assertThat(soru1).isEqualTo(soru2);
        soru2.setId(2L);
        assertThat(soru1).isNotEqualTo(soru2);
        soru1.setId(null);
        assertThat(soru1).isNotEqualTo(soru2);
    }
}
