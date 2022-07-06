package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KonuTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Konu.class);
        Konu konu1 = new Konu();
        konu1.setId(1L);
        Konu konu2 = new Konu();
        konu2.setId(konu1.getId());
        assertThat(konu1).isEqualTo(konu2);
        konu2.setId(2L);
        assertThat(konu1).isNotEqualTo(konu2);
        konu1.setId(null);
        assertThat(konu1).isNotEqualTo(konu2);
    }
}
