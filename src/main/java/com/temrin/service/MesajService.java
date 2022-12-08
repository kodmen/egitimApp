package com.temrin.service;

import com.temrin.domain.Mesaj;
import com.temrin.repository.MesajRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;

@Service
public class MesajService {

    final private MesajRepository mesajRepository;

    public MesajService(MesajRepository mesajRepository) {
        this.mesajRepository = mesajRepository;
    }

    public Mesaj kullaniciMesajOlustur(Mesaj m){
        m.setTarih(LocalDate.now());
        m.setGoruldu(false);
       return mesajRepository.save(m);
    }
}
