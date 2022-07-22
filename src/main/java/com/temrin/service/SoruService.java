package com.temrin.service;


import com.temrin.domain.Konu;
import com.temrin.domain.Soru;
import com.temrin.repository.SoruRepository;
import com.temrin.service.dto.SoruDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SoruService {

    private final SoruRepository repository;
    private final AwsService awsService;
    private final KonuService konuService;

    public SoruService(SoruRepository repository, AwsService awsService, KonuService konuService) {
        this.repository = repository;
        this.awsService = awsService;
        this.konuService = konuService;
    }

    /**
     * soru creat
     * @param dto
     * @return
     * @throws IOException
     */
    public Soru create(SoruDto dto) throws IOException {
        String key = UUID.randomUUID().toString();
        String pathToFile = "./" + key + ".";
        String[] s = dto.getImageContentType().split("/");
        pathToFile += s[1];
        String fileName = key + "." + s[1];

        File f = new File(pathToFile);
        FileOutputStream fos = new FileOutputStream(f);
        fos.write(dto.getImage());
        awsService.uploadFile(fileName, new File(pathToFile));
        f.delete();

        Soru soru = new Soru();
        soru.setCevap(dto.getCevap());
        soru.setIsim(dto.getIsim());
        soru.setSira(dto.getSira());
        soru.setKonu(dto.getKonu());
        soru.setResimUrl(fileName);
        soru.setA(dto.getA());
        soru.setB(dto.getB());
        soru.setC(dto.getC());
        soru.setD(dto.getD());
        soru.setCevapli(dto.getCevapli());

        return repository.save(soru);
    }

    public void delete(Long id) {
        //denemlerden silmem lazım

        Soru s = repository.getById(id);
        if (s.getResimUrl() != null) awsService.deleteFile(s.getResimUrl());

        repository.delete(s);
    }

    public List<Soru> getKonubySoru(Konu konu) {
        return repository.findByKonu(konu);
    }

    public List<Soru> getAllSoruByKonu(long konuId){
        return getKonubySoru(konuService.getById(konuId));
    }

    public String findBySoruIdGetCevap(long id) {
        Optional<Soru> soru = repository.findById(id);
        return soru.isPresent() ? soru.get().getCevap() : "yanlis";
    }

    public String findBySoruIdGetIsim(long id) {
        Optional<Soru> soru = repository.findById(id);
        return soru.isPresent() ? soru.get().getIsim() : "yanlis";
    }

    public Page<Soru> getAllManagedSoru(Pageable pageable) {

        Pageable p = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("konu"));

        return repository.findAllWithEagerRelationships(p);
    }
}
