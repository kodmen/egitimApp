package com.temrin.service.dto.deneme;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import static org.junit.jupiter.api.Assertions.*;

class DenemeSonuclariDtoTest {

    @ParameterizedTest
    @DisplayName("To check whether the length of the strings are same or not")
    @CsvSource({
        "5,    5,0,50",
        "6,   6,8,30",
        "30, 5, 0, 85.71429",
        "10,10,10,33.333332",
        "30,4,0,88.23529"
    })
    void getTest(int dogru, int yanlis, int bos, float sonuc) {

        DenemeSonuclariDto dto = new DenemeSonuclariDto();
        dto.setDogru(dogru);
        dto.setYanlis(yanlis);
        dto.setBos(bos);
        assertEquals(sonuc, dto.getPuan());

    }

}
