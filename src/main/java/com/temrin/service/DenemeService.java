package com.temrin.service;


import com.temrin.domain.*;
import com.temrin.repository.DenemeRepository;
import com.temrin.service.dto.DenemeDTO;
import com.temrin.service.dto.KonuDTO;
import com.temrin.service.dto.deneme.DenemeCevapRequest;
import com.temrin.service.dto.deneme.DenemeSinavDto;
import com.temrin.service.dto.deneme.DenemeSonuclariDto;
import com.temrin.service.dto.deneme.DenemeSoruDto;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

import static com.temrin.security.SecurityUtils.getCurrentUserLogin;

@Service
public class DenemeService {

    private final DenemeRepository repository;
    private final UserService userService;
    private final SinifService sinifService;
    private final AuthorityService authorityService;
    private final KonuService konuService;
    private final SoruService soruService;
    private final DenemeAnalizSinifService denemeAnalizSinifService;
    private final DenemeAnalizService denemeAnalizService;

    public DenemeService(
        DenemeRepository repository,
        UserService userService,
        SinifService sinifService,
        AuthorityService authorityService,
        KonuService konuService,
        SoruService soruService,
        DenemeAnalizSinifService denemeAnalizSinifService,
        DenemeAnalizService denemeAnalizService
    ) {
        this.repository = repository;
        this.userService = userService;
        this.sinifService = sinifService;
        this.authorityService = authorityService;
        this.konuService = konuService;
        this.soruService = soruService;
        this.denemeAnalizSinifService = denemeAnalizSinifService;
        this.denemeAnalizService = denemeAnalizService;
    }

    /**
     * eğer öğr deneyi daha önce çözmüşse denemeye giremesin
     * @param denemeid
     * @return denemeye girdi mi
     */
    public boolean ogrDenemeyeGirmismi(long denemeid){
        User ogr = userService.getCurrentUser();
        return denemeAnalizService.existDenemeAndUser(denemeid,ogr);
    }

    /**
     * geri dönüş değeri deneme analiz id
     * @param request
     * @return
     */
    public long cevapKontrol(DenemeCevapRequest request) {
        Deneme deneme = repository.getById(request.getDenemeId());
        String[] cevaplar = deneme.getCevapAnahtar().split(",");
        DenemeSonuclariDto sonuclar = new DenemeSonuclariDto();

        HashMap<Long, String> cevaplarMap = new HashMap<>();

        String yanlisKonu = "";
        String bosKonu = "";

        for (int i = 0; i < request.getSorular().size(); i++) {
            cevaplarMap.put(request.getSorular().get(i).getSoruId(), request.getSorular().get(i).getCevap());
        }

        for (Map.Entry<Long, String> entry : cevaplarMap.entrySet()) {
            Long key = entry.getKey();
            String kullaniciCevap = entry.getValue();
            String cevap = soruService.findBySoruIdGetCevap(key);

            if (kullaniciCevap.equals("") || kullaniciCevap.equals(" ")) {
                sonuclar.bosArttir();
                String isim = soruService.findBySoruIdGetIsim(key);
                bosKonu += isim + " ";
            } else if (cevap.equals(kullaniciCevap)) {
                sonuclar.dogruArttir();
            } else {
                sonuclar.yanlisArttir();
                String isim = soruService.findBySoruIdGetIsim(key);
                yanlisKonu += isim + " ";
            }
        }

        DenemeAnaliz denemeAnaliz = new DenemeAnaliz();
        denemeAnaliz.setDeneme(deneme);
        denemeAnaliz.setUser(userService.getCurrentUser());
        denemeAnaliz.setDogru(sonuclar.getDogru());
        denemeAnaliz.setYanlis(sonuclar.getYanlis());
        denemeAnaliz.setPuan((int) sonuclar.getPuan());

        denemeAnaliz.setKonuAnalizJson("yanlis: " + yanlisKonu + "-- Bos: " + bosKonu);
        denemeAnaliz = denemeAnalizService.create(denemeAnaliz);

        DenemeAnalizSinif denemeAnalizSinif = denemeAnalizSinifService.getDeneme(deneme);
        denemeAnalizSinif.setOrtalama(sinifOrtalamasiEkle(denemeAnalizSinif, sonuclar.getPuan()));
        denemeAnalizSinifService.updateDenemeAnaliz(denemeAnalizSinif);

        return denemeAnaliz.getId();
    }

    public float sinifOrtalamasiEkle(DenemeAnalizSinif denemeAnalizSinif, float puan) {
        float ortalama = denemeAnalizSinif.getOrtalama();
        if (ortalama == 0) {
            return puan;
        }
        return (ortalama + puan) / 2;
        // sınava giren öğrenciler adedince ort
    }

    public DenemeSinavDto denemeSinavOlustur(long denemeId) {
        Deneme deneme = repository.getById(denemeId);
        DenemeSinavDto denemeSinav = new DenemeSinavDto();

        denemeSinav.setDenemeId(deneme.getId());
        List<DenemeSoruDto> sorular = new ArrayList<>();

        for (Soru s : deneme.getSorulars()) {
            if (s.getCevapli()){
                sorular.add(DenemeSoruDto.creatDenemeSoruDtoCevapli(s.getResimUrl(), s.getId(),s.getA(),s.getB(),s.getC(),s.getD()));
            }else{
                sorular.add(DenemeSoruDto.creatDenemeSoruDtoCevapsiz(s.getResimUrl(),s.getId()));
            }
        }

        denemeSinav.setSorular(sorular);

        return denemeSinav;
    }

    public Deneme create(DenemeDTO dto) throws ParseException {
        Deneme entity = new Deneme();
        entity.setOlusturan(userService.getCurrentUser());
        entity.setOlusturmaTarih(LocalDate.now());
        entity.setIsim(dto.getIsim());
        entity.setSure(dto.getSure());
        entity.setBaslamaTarih(dto.getBaslamaTarih());
        entity.setSorulars(new HashSet<Soru>());
        for (KonuDTO konu : dto.getKonudto()) {
            entity.getSorulars().addAll(getKonuyaGoreSoru(konu));
        }
        entity.setCevapAnahtar(getCevapAnahtari(entity.getSorulars()));

        entity = repository.save(entity);
        denemeAnalizSinifService.DenemeAnalizSinifCreate(entity);

        return entity;
    }

    private List<Soru> getKonuyaGoreSoru(KonuDTO konuDTO) {
        Konu konu = konuService.getById(Long.valueOf(konuDTO.getKonu()));
        List<Soru> sorular = soruService.getKonubySoru(konu);

        List<Soru> result = sorular
            .stream()
            .filter(s -> s.getSira() >= konuDTO.baslangic && s.getSira() <= konuDTO.getBitis())
            .collect(Collectors.toList());

        return belliSoruyuGetir(result, konuDTO.getSoruSayisi());
    }

    private String getCevapAnahtari(Set<Soru> sorular) {
        return sorular.stream().map(s -> s.getCevap()).collect(Collectors.joining(","));
    }

    /**
     * girilen soru adedince geriye random o kadar soru getircek
     *
     * @param sorular
     * @param kacAdet
     * @return
     */
    private List<Soru> belliSoruyuGetir(List<Soru> sorular, int kacAdet) {
        List<Soru> result = new ArrayList<>();

        for (int i = 0; kacAdet > i; i++) {
            Soru temp = sorular.stream().skip((int) (sorular.size() * Math.random())).findAny().get();
            result.add(temp);
            sorular.remove(temp);
        }
        return result;
    }

    public List<Deneme> getAllDeneme() {
        switch (userService.getAuth()) {
            case "ROLE_ADMIN":
                return repository.findAllWithEagerRelationships();
            case "ROLE_MESUL":
                return getMesulDeneme();
            case "ROLE_HOCA":
                return repository.findByOlusturanIsCurrentUser();
            case "ROLE_USER":
                return getOgrDeneme();
            default:
                return Collections.emptyList();
        }
    }

    private List<Deneme> getOgrDeneme() {
        // bir gün önce
        LocalDate birHaftaOnce = LocalDate.now().minusDays(2);
        LocalDate birHaftaSonra = LocalDate.now().plusDays(2);

        Instant tt = birHaftaOnce.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant dd = birHaftaSonra.atStartOfDay(ZoneId.systemDefault()).toInstant();

        Optional<User> u = userService.getUserLogin(getCurrentUserLogin().get());
        Sinif s = sinifService.getOrgSinif(u.get());
        return repository.findAllByBaslamaTarihBetweenAndOlusturan(tt, dd, s.getHoca());
        //        List<Deneme> denemes = repository.findAllByBaslamaTarihBetween(tt, dd);
        //        return denemes.stream().filter(d -> d.getOlusturan() == s.getHoca()).collect(Collectors.toList());
    }

    private List<Deneme> getMesulDeneme() {
        Authority authority = authorityService.getAuthorityByName("ROLE_HOCA");
        List<User> hocalar = userService.getAuthUser(authority);
        List<Deneme> yurtGenelDeneme = new ArrayList<>();
        for (User h : hocalar) {
            yurtGenelDeneme.addAll(getOgrDeneme(h));
        }

        return yurtGenelDeneme;
    }

    private List<Deneme> getOgrDeneme(User u) {
        LocalDate birHaftaOnce = LocalDate.now().minusDays(1);
        LocalDate birHaftaSonra = LocalDate.now().plusDays(1);

        Instant tt = birHaftaOnce.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant dd = birHaftaSonra.atStartOfDay(ZoneId.systemDefault()).toInstant();

        return repository.findAllByBaslamaTarihBetweenAndOlusturan(tt, dd, u);
    }
}
