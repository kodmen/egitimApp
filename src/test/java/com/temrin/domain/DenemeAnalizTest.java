package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DenemeAnalizTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DenemeAnaliz.class);
        DenemeAnaliz denemeAnaliz1 = new DenemeAnaliz();
        denemeAnaliz1.setId(1L);
        DenemeAnaliz denemeAnaliz2 = new DenemeAnaliz();
        denemeAnaliz2.setId(denemeAnaliz1.getId());
        assertThat(denemeAnaliz1).isEqualTo(denemeAnaliz2);
        denemeAnaliz2.setId(2L);
        assertThat(denemeAnaliz1).isNotEqualTo(denemeAnaliz2);
        denemeAnaliz1.setId(null);
        assertThat(denemeAnaliz1).isNotEqualTo(denemeAnaliz2);
    }
}
