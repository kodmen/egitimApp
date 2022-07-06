package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class YurtTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Yurt.class);
        Yurt yurt1 = new Yurt();
        yurt1.setId(1L);
        Yurt yurt2 = new Yurt();
        yurt2.setId(yurt1.getId());
        assertThat(yurt1).isEqualTo(yurt2);
        yurt2.setId(2L);
        assertThat(yurt1).isNotEqualTo(yurt2);
        yurt1.setId(null);
        assertThat(yurt1).isNotEqualTo(yurt2);
    }
}
