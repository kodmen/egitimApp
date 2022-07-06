package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DenemeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Deneme.class);
        Deneme deneme1 = new Deneme();
        deneme1.setId(1L);
        Deneme deneme2 = new Deneme();
        deneme2.setId(deneme1.getId());
        assertThat(deneme1).isEqualTo(deneme2);
        deneme2.setId(2L);
        assertThat(deneme1).isNotEqualTo(deneme2);
        deneme1.setId(null);
        assertThat(deneme1).isNotEqualTo(deneme2);
    }
}
