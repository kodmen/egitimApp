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
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

import static com.temrin.security.AuthoritiesConstants.*;
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
    private final YurtService yurtService;

    public DenemeService(
        DenemeRepository repository,
        UserService userService,
        SinifService sinifService,
        AuthorityService authorityService,
        KonuService konuService,
        SoruService soruService,
        DenemeAnalizSinifService denemeAnalizSinifService,
        DenemeAnalizService denemeAnalizService,
        YurtService yurtService) {
        this.repository = repository;
        this.userService = userService;
        this.sinifService = sinifService;
        this.authorityService = authorityService;
        this.konuService = konuService;
        this.soruService = soruService;
        this.denemeAnalizSinifService = denemeAnalizSinifService;
        this.denemeAnalizService = denemeAnalizService;
        this.yurtService = yurtService;
    }

    /**
     * eğer öğr deneyi daha önce çözmüşse denemeye giremesin
     *
     * @param denemeid
     * @return denemeye girdi mi
     */
    public boolean ogrDenemeyeGirmismi(long denemeid) {
        User ogr = userService.getCurrentUser();
        return denemeAnalizService.existDenemeAndUser(denemeid, ogr);
    }

    /**
     * geri dönüş değeri deneme analiz id
     *
     * heh dogru senaryoyu test ediyorum yanlış senaryoda
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
                bosKonu += isim + ", ";
            } else if (cevap.equals(kullaniciCevap)) {
                sonuclar.dogruArttir();
            } else {
                sonuclar.yanlisArttir();
                String isim = soruService.findBySoruIdGetIsim(key);
                yanlisKonu += isim + ", ";
            }
        }

        DenemeAnaliz denemeAnaliz = new DenemeAnaliz();
        denemeAnaliz.setDeneme(deneme);
        denemeAnaliz.setUser(userService.getCurrentUser());
        denemeAnaliz.setDogru(sonuclar.getDogru());
        denemeAnaliz.setYanlis(sonuclar.getYanlis());
        denemeAnaliz.setPuan((int) sonuclar.getPuan());
        denemeAnaliz.setSure(request.getSure());

        denemeAnaliz.setKonuAnalizJson("yanlis: " + yanlisKonu + "-- Bos: " + bosKonu);
        denemeAnaliz = denemeAnalizService.create(denemeAnaliz);

        DenemeAnalizSinif denemeAnalizSinif = denemeAnalizSinifService.getDeneme(deneme);
        denemeAnalizSinif.setOrtalama(sinifOrtalamasiEkle(denemeAnalizSinif, sonuclar.getPuan()));
        denemeAnalizSinifService.updateDenemeAnaliz(denemeAnalizSinif);

        return denemeAnaliz.getId();
    }

    /**
     * karıxık olan soru analizleri düzenli şekle getiren fonks
     *
     * @param analiz
     * @return
     */
    public String soruAnalizDuzenle(String analiz) {

        Set<String> konular = new HashSet<>();
        String sorular[] = analiz.split(",");
        // her soruyu tekrar ikiye ayırmam lazım
        for (String soru : sorular) {
            var konusayi = soru.split(" ");
            var soruKonu = konusayi[0];
            var sorusayi = konusayi[1];
            konular.add(soruKonu);
        }


        return null;
    }

    public float sinifOrtalamasiEkle(DenemeAnalizSinif denemeAnalizSinif, float puan) {
        float ortalama = denemeAnalizSinif.getOrtalama();
        if (ortalama == 0) {
            return puan;
        }
        return (ortalama + puan) / 2;
        // sınava giren öğrenciler adedince ort
    }

    /**
     * oluşturulan denemiyi clentin anlayacağı şekle çeviriyor
     *
     * @param denemeId
     * @return
     */
    public DenemeSinavDto denemeSinavOlustur(long denemeId) {
        Deneme deneme = repository.getById(denemeId);
        DenemeSinavDto denemeSinav = new DenemeSinavDto();

        denemeSinav.setOlusturan(deneme.getOlusturan().getLogin());
        denemeSinav.setDenemeId(deneme.getId());
        List<DenemeSoruDto> sorular = new ArrayList<>();

        for (Soru s : deneme.getSorulars()) {
            if (s.getCevapli()) {

                sorular.add(DenemeSoruDto.creatDenemeSoruDtoCevapli(s.getResimUrl(),s.getMetin(), s.getId(), s.getA(), s.getB(), s.getC(), s.getD()));
            } else {
                sorular.add(DenemeSoruDto.creatDenemeSoruDtoCevapsiz(s.getResimUrl(),s.getMetin(), s.getId()));
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

    /**
     * konuya göre soru getirme
     *
     * @param konuDTO konu ve soru adedi
     * @return sorular
     */
    private List<Soru> getKonuyaGoreSoru(KonuDTO konuDTO) {

        // konu id ile konuyu getirilir
        Konu konu = konuService.getById(Long.valueOf(konuDTO.getKonu()));

        // konuya ait sorular getirilir
        List<Soru> sorular = soruService.getKonubySoru(konu);


        Collections.sort(sorular,Collections.reverseOrder());
        int bitis = sorular.get(0).getSira();
        int baslangic ;

        if (sorular.get(sorular.size()-1).getSira() == 1){
            baslangic = konuDTO.baslangic;
        }else{
            baslangic = konuDTO.baslangic + sorular.get(sorular.size()-1).getSira();
        }

        List<Soru> result = sorular
            .stream()
            .filter(s -> s.getSira() >= (baslangic) && s.getSira() <= (konuDTO.getBitis() + baslangic ))
            .collect(Collectors.toList());

        return belliSoruyuGetir(result, konuDTO.getSoruSayisi());
    }

    private String getCevapAnahtari(Set<Soru> sorular) {
        return sorular.stream().map(s -> s.getCevap()).collect(Collectors.joining(","));
    }

    /**
     * soru listesinin içinden soru geri döndürür
     *
     * @param sorular sorular
     * @param kacAdet soruların içinden kaç adet soru old
     * @return seçilmeş sorular
     */
    private List<Soru> belliSoruyuGetir(List<Soru> sorular, int kacAdet) {
        // benim burda soru adedince

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
            case ADMIN:
                return repository.findAllWithEagerRelationships();
            case MESUL:
                return getMesulDeneme();
            case HOCA:
                return repository.findByOlusturanIsCurrentUser();
            case USER:
                return getOgrDeneme();
            default:
                return Collections.emptyList();
        }
    }

    /**
     * burda adminin olusturudğu günlük denemeleri getircek
     * en son hangi denemeyi oluşturduysa onu getircek
     *
     * @return
     */
    public Deneme getGunlukDeneme() {
        Optional<User> admin = userService.getUserLogin("admin");
        return repository.findTopByOlusturanOrderByIdDesc(admin.get());
    }

    private List<Deneme> getOgrDeneme() {
        // bir gün önce
        LocalDate birHaftaOnce = LocalDate.now().minusDays(2);
        LocalDate birHaftaSonra = LocalDate.now().plusDays(2);

        Instant tt = birHaftaOnce.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant dd = birHaftaSonra.atStartOfDay(ZoneId.systemDefault()).toInstant();

        Optional<User> u = userService.getUserLogin(getCurrentUserLogin().get());
        Sinif s = sinifService.getOrgSinif(u.get());
        List<Deneme> userAitDenemeler = repository.findAllByBaslamaTarihBetweenAndOlusturan(tt, dd, s.getHoca());
        if (userAitDenemeler.size() > 0){
            userAitDenemeler.add(getGunlukDeneme());
            return userAitDenemeler;
        }
        return Collections.singletonList(getGunlukDeneme());
    }

    private List<Deneme> getMesulDeneme() {
        // ait old yurdun denemelri degil
        Authority authority = authorityService.getAuthorityByName("ROLE_HOCA");
        // yurdu getir
        Yurt y = yurtService.getYurtByMesul(userService.getCurrentUser());
        List<Sinif> siniflar = sinifService.getAllSinifByYurt(y);
        List<User> hocalar = new ArrayList<>();
        for (Sinif s : siniflar) {
            hocalar.add(s.getHoca());
        }
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

    public void denemeSil(long denemId) {
        // önce deneme analiz sınıfı bul
        Deneme d = repository.getById(denemId);

        DenemeAnalizSinif denemeAnalizSinif = denemeAnalizSinifService.getDeneme(d);
        denemeAnalizSinifService.denemeAnalizSinifSil(denemeAnalizSinif);

        // deneme analizleri bul
        List<DenemeAnaliz> denemeAnalizs = denemeAnalizService.getDenemeAnalizByDeneme(d);
        denemeAnalizService.denemeAnalizListSil(denemeAnalizs);

        // sonra denemeyi sil
        repository.delete(d);

    }
}
