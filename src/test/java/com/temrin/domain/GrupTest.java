package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GrupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Grup.class);
        Grup grup1 = new Grup();
        grup1.setId(1L);
        Grup grup2 = new Grup();
        grup2.setId(grup1.getId());
        assertThat(grup1).isEqualTo(grup2);
        grup2.setId(2L);
        assertThat(grup1).isNotEqualTo(grup2);
        grup1.setId(null);
        assertThat(grup1).isNotEqualTo(grup2);
    }
}
