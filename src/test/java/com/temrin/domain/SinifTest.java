package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SinifTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sinif.class);
        Sinif sinif1 = new Sinif();
        sinif1.setId(1L);
        Sinif sinif2 = new Sinif();
        sinif2.setId(sinif1.getId());
        assertThat(sinif1).isEqualTo(sinif2);
        sinif2.setId(2L);
        assertThat(sinif1).isNotEqualTo(sinif2);
        sinif1.setId(null);
        assertThat(sinif1).isNotEqualTo(sinif2);
    }
}
