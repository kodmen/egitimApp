
# Temrin Matik: Öğrencilere Yön Veren Eğitim Platformu

Temrin Matik, öğrencilerin deneme çözebileceği ve ders çalışabileceği interaktif bir eğitim platformudur. Eğitim sürecini daha etkili ve keyifli hale getirmeyi amaçlayan bu platform, öğrencilere özel tasarlanmış bir deneyim sunar. Editörler tarafından eklenen zengin içerikleriyle öğrenciler, konuları daha iyi anlamalarına yardımcı olan soruları çözebilir ve performanslarını geliştirebilirler.

## Projenin Temel Amacı

Temrin Matik, eğitim sürecini destekleyen bir dizi özellik sunarak öğrencilere rehberlik etmeyi hedefler. Platform, öğrencilerin deneme çözme pratiği yapmalarını sağlar ve bu süreçte öğrenmelerini artıracak zengin içeriklere erişim imkanı tanır. Aynı zamanda öğretmenler için de bir ara yüz sunarak, öğrenci performanslarını izleme ve değerlendirme imkanı sağlar.

## Projenin Teknik Altyapısı

Temrin Matik'in güçlü teknik altyapısı, projenin istikrarlı bir şekilde çalışmasını sağlar. Backend tarafında Java Spring Boot kullanılarak güçlü ve ölçeklenebilir bir sistem oluşturulurken, veritabanı olarak PostgreSQL tercih edilmiştir. Frontend kısmında Angular kullanılarak kullanıcı dostu ve etkileşimli bir arayüz tasarlanmıştır. Projenin yayınlanması ve hostingi için Heroku tercih edilirken, dosya depolama için AWS S3 kullanılmaktadır.

## Projeyi Başlatma Adımları

Projeyi başlatmak için aşağıdaki adımları takip edebilirsiniz:
1. Veritabanı bilgilerini güncelleyin.
2. E-posta bilgilerini güncelleyin.
3. AWS S3 bilgilerini güncelleyin.

Bu adımları takip ederek, Temrin Matik'i sorunsuz bir şekilde başlatabilir ve öğrencilerinize interaktif bir eğitim deneyimi sunabilirsiniz.

# Database Şeması
![Projenin Database Şeması](./temrin-resimler/DB.png)
*Projenin Veritabanı Şeması*

# Kullanıcı Rollerine Özel Özellikler

## Giriş Sayfası
Uygulamanın ana giriş sayfası, kullanıcılarına hızlı ve kolay bir şekilde sisteme erişim sağlar.
![Giriş Sayfası ve Kayıt Olma Ekranı](./temrin-resimler/giris/giris.gif)
*Giriş Sayfası ve Kayıt Olma Ekranı*

![Login Sayfası](./temrin-resimler/giris/login-sayfası.png)
*Login Sayfası*

![Kayıt Olma](./temrin-resimler/giris/kayıt-olma.png)
*Kayıt Olma Ekranı*

![Şifremi Unuttum](./temrin-resimler/giris/şifremi-unuttum.png)
*Şifremi Unuttum Ekranı*

![İletişim Sayfası](./temrin-resimler/giris/iletisim-sayfası.png)
*İletişim Sayfası*

## Öğrenci Özellikleri
Öğrenciler, denemeleri çözebilir, performanslarını takip edebilir ve öğrenim materyallerine erişim sağlayabilir.
![Kullanıcı Ayarları](./temrin-resimler/öğrenci/kullanıcı-ayarları.png)
*Kullanıcı Ayarları*

![Sınıf Yoksa Ekran](./temrin-resimler/öğrenci/sınıf-yoksa-ekran.png)
*Sınıf Yoksa Ekran*

![Sınıf Kodu Girilir](./temrin-resimler/öğrenci/sınıf-kodu-girilir.png)
*Sınıf Kodu Girilir Ekranı*

![Sınıf Gelir](./temrin-resimler/öğrenci/sınıf-gelir.png)
*Sınıf Gelir Ekranı*

![Denemeler Sayfası](./temrin-resimler/öğrenci/denemeler-sayfası.png)
*Denemeler Sayfası*

![Deneme Giriş](./temrin-resimler/öğrenci/deneme-giris.png)
*Deneme Giriş Ekranı*

![Deneme Çıkış](./temrin-resimler/öğrenci/deneme-cikis.png)
*Deneme Çıkış Ekranı*

![Girilen Deneme Analiz](./temrin-resimler/öğrenci/girilen-deneme-analiz.png)
*Girilen Deneme Analiz Ekranı*

![Deneme Analiz Sayfası](./temrin-resimler/öğrenci/deneme-analiz-sayfası.png)
*Deneme Analiz Sayfası*

![Ders Çalışma Bos Ekran](./temrin-resimler/öğrenci/ders-calisma-bos-ekran.png)
*Ders Çalışma Boş Ekran*

![Ders Çalışma Ders Seçili](./temrin-resimler/öğrenci/ders-calisma-ders-secili.png)
*Ders Çalışma Ders Seçili Ekran*

![Ders Çalışma Sorular Gelir](./temrin-resimler/öğrenci/ders-calisma-sorular%20-gelir.png)
*Ders Çalışma Soruları Ekranı*

## Öğretmen Özellikleri
Öğretmenler, sorular ekleyebilir, öğrenci performanslarını değerlendirebilir ve öğrencilere özel geri bildirimler sağlayabilir.
![Sınıf Ekranı](./temrin-resimler/öğrentmex/sınıf%20.png)
*Sınıf Ekranı*

![Sınıf Öğrenci Görüntüleme](./temrin-resimler/öğrentmex/sinif-ogrenci-goruntuleme.gif)
*Sınıf Öğrenci Görüntüleme Ekranı*

![Oluşturulan Denemeler](./temrin-resimler/öğrentmex/oluşturulan-denemeler.png)
*Oluşturulan Denemeler Ekranı*

![Deneme Oluşturma](./temrin-resimler/öğrentmex/deneme-oluşturma.png)
*Deneme Oluşturma Ekranı*

![Deneme Analiz](./temrin-resimler/öğrentmex/deneme-analiz.png)
*Deneme Analiz Ekranı*

## Admin Özellikleri
Admin kullanıcıları, platformun genel yönetimini sağlar, kullanıcı hesaplarını yönetir ve sistemin genel performansını takip eder.
![Kullanıcı Listesi](./temrin-resimler/admin/kullanıcı-listesi.png)
*Kullanıcı Listesi Ekranı*

![Dönem Liste](./temrin-resimler/admin/dönem-liste.png)
*Dönem Liste Ekranı*

![Admin Menü](./temrin-resimler/admin/admin-menu.png)
*Admin Menü Ekranı*

![Yurtlar Liste](./temrin-resimler/admin/yurtlar-liste.png)
*Yurtlar Listesi Ekranı*

![Yurt Oluşturma](./temrin-resimler/admin/yurt-oluşturma.png)
*Yurt Oluşturma Ekranı*

![Sınıflar Liste](./temrin-resimler/admin/sınıflar-liste.png)
*Sınıflar Listesi Ekranı*

![Sınıf Oluşturma](./temrin-resimler/admin/sınıf-olusturma.png)
*Sınıf Oluşturma Ekranı*

![Mesajlar Sayfası](./temrin-resimler/admin/mesajlar-sayfası.png)
*Mesajlar Sayfası Ekranı*

![Denemeler Liste](./temrin-resimler/admin/denemeler-liste.png)
*Denemeler Listesi Ekranı*

![Denemeler PDF Oluşturma](./temrin-resimler/admin/denemeler-pdf-olusturma.png)
*Denemeler PDF Oluşturma Ekranı*

![Deneme Analizleri Liste](./temrin-resimler/admin/deneme-analizleri-liste.png)
*Deneme Analizleri Listesi Ekranı*

![Öğrenci Deneme Analiz](./temrin-resimler/admin/ogrenci-deneme-analiz.png)
*Öğrenci Deneme Analiz Ekranı*

![Gruplar Liste](./temrin-resimler/admin/guruplar-liste.png)
*Gruplar Listesi Ekranı*

![Konular Liste](./temrin-resimler/admin/konular-liste.png)
*Konular Listesi Ekranı*

![Konu Sorular Liste](./temrin-resimler/admin/konu-sorular-liste.png)
*Konu Sorular Listesi Ekranı*

![Sorular Liste](./temrin-resimler/admin/sorular-liste.png)
*Sorular Listesi Ekranı*

![Toplu Soru Ekleme](./temrin-resimler/admin/toplu-soru-ekleme.png)
*Toplu Soru Ekleme Ekranı*

Temrin Matik, öğrencilerinizi destekleyen ve eğitim sürecini daha etkili hale getiren bir çözüm sunar.
