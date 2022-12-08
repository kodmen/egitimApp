package com.temrin.service;

import com.temrin.domain.Deneme;
import com.temrin.domain.DenemeAnaliz;
import com.temrin.domain.Sinif;
import com.temrin.domain.User;
import com.temrin.repository.DenemeAnalizRepository;
import com.temrin.service.dto.DenemeAnalizSiralamaDto;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class DenemeAnalizService {

    private final DenemeAnalizRepository repository;
    private final UserService userService;
    private final DenemeService denemeService;
    private final SinifService sinifService;

    public DenemeAnalizService(DenemeAnalizRepository repository, UserService userService, @Lazy DenemeService denemeService, SinifService sinifService) {
        this.repository = repository;
        this.userService = userService;
        this.denemeService = denemeService;
        this.sinifService = sinifService;
    }


    /**
     * deneme analizinde en son olan denemenin analizini getiriyor
     *
     * @return
     */
//    public Page<DenemeAnalizSiralamaDto> getAllAnaliz(Pageable pageable) {
//        List<DenemeAnalizSiralamaDto> dtos = new ArrayList<>();
//
//        Deneme gunlukDeneme = denemeService.getGunlukDeneme();
//        Pageable p = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
//
//        Page<DenemeAnaliz> top10analiz = repository.findAllByDenemeOrderByPuanDescSureAsc(gunlukDeneme, p);
//
//        for (DenemeAnaliz analiz : top10analiz.getContent()) {
//            DenemeAnalizSiralamaDto dto = new DenemeAnalizSiralamaDto();
//            dto.setSure(analiz.getSure());
//            dto.setPuan(analiz.getPuan());
//            dto.setUser(analiz.getUser());
//
//            Sinif s = sinifService.getOrgSinif(analiz.getUser());
//            if (s.getYurt() != null) {
//                String yurtIsim = s.getYurt().getIsim();
//                dto.setYurt(yurtIsim);
//            }
//
//
//            dtos.add(dto);
//        }
//
//        //gönderilecek içerik pageable nesne ve toplam eleman sayisi
//        Page<DenemeAnalizSiralamaDto> pages = new PageImpl<DenemeAnalizSiralamaDto>(dtos, pageable, top10analiz.getTotalElements());
//
//        return pages;
//    }

    public boolean existDenemeAndUser(long id, User u) {
        return repository.existsByDeneme_IdAndUser(id, u);
    }

    public DenemeAnaliz create(DenemeAnaliz denemeAnaliz) {
        return repository.save(denemeAnaliz);
    }

    public Page<DenemeAnaliz> getAllDeneme(Pageable pageable) {
        switch (userService.getAuth()) {
            case "ROLE_ADMIN":
                return repository.findAllWithEagerRelationships(pageable);
            case "ROLE_HOCA":
                // BURDA EĞER HEM ÖĞRENCİ HEM ÖRETMENSE BURDA HATA VERİY
                return repository.findByDeneme_Olusturan(userService.getCurrentUser(),pageable);
            case "ROLE_USER":
                return repository.findByUserIsCurrentUser(pageable);
            default:
                return null;
        }
    }

    /**
     * burda denemeId ve OluşturanId göre denemeleri getiriyoruz
     * yani hoca denemeye göre sınıfındaki öğrencilerin denemelerini getiriyor
     *
     * @param denemeId
     * @return
     */
    public List<DenemeAnaliz> getHocaDeneme(long denemeId) {
        return repository.findByDeneme_OlusturanAndDeneme_Id(userService.getCurrentUser(), denemeId);
    }

    public List<DenemeAnaliz> getDenemeAnalizByDeneme(Deneme d) {
        return repository.findByDeneme(d);
    }

    public void denemeAnalizListSil(List<DenemeAnaliz> silincek) {
        repository.deleteAll(silincek);
    }


}
