package com.temrin.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.temrin.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DenemeAnalizSinifTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DenemeAnalizSinif.class);
        DenemeAnalizSinif denemeAnalizSinif1 = new DenemeAnalizSinif();
        denemeAnalizSinif1.setId(1L);
        DenemeAnalizSinif denemeAnalizSinif2 = new DenemeAnalizSinif();
        denemeAnalizSinif2.setId(denemeAnalizSinif1.getId());
        assertThat(denemeAnalizSinif1).isEqualTo(denemeAnalizSinif2);
        denemeAnalizSinif2.setId(2L);
        assertThat(denemeAnalizSinif1).isNotEqualTo(denemeAnalizSinif2);
        denemeAnalizSinif1.setId(null);
        assertThat(denemeAnalizSinif1).isNotEqualTo(denemeAnalizSinif2);
    }
}
