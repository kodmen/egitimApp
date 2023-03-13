## ilk öncelik

1. ~~ders çalışma sayfası geri gelince ders seçte iktikrarsızlık var~~
2. ~~TOPLU SORU EKLERKEN SORU EKLE YERİNE DENEME OLUŞTUR YAZIYOR~~
3. denemeyi pdf olarak göstersin ve indirsin
4. hoca denemeyi oluştururken toplam soru gösterilsin
5. hoca denemeyi düzeltirken soruları düzeltemesin
6. ~~bir hocaya birden çok sınıf verilebilir mi( analizleri sınıf ide göre getirmeli- deneme oluştururken hocanın sınıfı fazla old için hata alıyoruz)~~
7. ~~eğer hocanın çok sınıfı yoksa sınıflar dropdown gözükmesin~~
8. deneme çözme tasarımı ders çalışma gibi olsun
9. düzgün bir proje tanıtım sayfası lazım
10. sınıfa eklenen sorularda düzgün gözüksün çok karışık duruyor
11. deneme analiz sınıfda pageable olmalı sistem yoruluyor
12. ~~tekli soruda eğer metinse resim null dönüyor~~

- döneme ait sorular gözükmeli
- yada grup ve konuya dönem eklenebilir 
- AUTH KISMI düzeltilmeli
- editor ve öğrenci aynı anda eklenmiyor
- TOPLU SORU EKLERKEN KONUYU VERİRKEN ÖNCE GRUBU SORABİLİRİZ ÇOK FAZLA KONU OLUNCA KARIŞABİLİR
- deneme analiz sayfasını create olmasına gerek yok 
- mesulun sınıfları başka hocanın sınıfları başka olmalı
- deneme sınıf analiz incelenirken admin girice girmiyor admin girince olması lazım 
- ders çalışma yerinde seçtikten sonra geri tekrar ders seçerken (seçili gurup  ) gözüküyor ama konular gelmiyor seçilmemiş gibi oluyor tekrar gurupları getirmesin
- ders çalışırken geri gelince sorular yanlış gösteriyor boş göstermesi lazım 
- destek safyası lazım 
- denemeleri pdf olarak indirebilenecek yer lazım 

- soru olarak göster diye bir şey koyulabilir soru liste

- ders çalış sayfasına soruları çağırınca drapdown koymak lazım istediğiimiz soruya gitme eklenmeli
- deneme oluştuurken toplam soru sayısı gözüksün 
- hocalarda denemeler kısmı pageable olmalı [x]
  
- konulardan soru ekleyince soru gösterilsin false ekliyor(güncelleyince düzeliyor)(güzuksun null gidiyor)
- yeni soru eklerken bir sürü konu içinden seçmek yerine önce grup secilir o gurubun konusu gelir sonra

- soru güncelleyince bazı veriler siliniyor gözükebilme null oluyor(çüknkü soru entitisinde get set yapmadım)

- SORU KISMINA EKLEME VE TOPLU SORU EKLEME YERİNE ADMİN VE EDİTORE AİT YERİNE EKLENDİ
## ikinci öncelik
- kahoot sitesindeki documantasyon sayfası gibi sayfa yalılabilir
- iletişim sayfası
- destek sayfası 
  
- deneme sayafa tasarımı ve giriş tarasımı güncellenmeli
- soru guncelleme( olusturulan soruyu güncellerken resim güncellenmiyor)
- deneme olustururken eger fazla soru sayisi girersek hata veriyor ve hatayı söylemiyor



DERS ÇALIŞ SAYFASINA SORUYA GİT EKLENEBİLİR
DENEME SAYFASINI PAGEABLE YAPILMALI
DENEME ANALİZİNDE YAPILAN DENEME ANALİZ SINIFTADA YAPILABİLİR
DENEME ANALİZ SINFI PAGEABLE OLMALI

DENEME ANALİZLERİNİ PAGEABLE YAPAYIM
sınıfı hocasız açarsak ne olur

mesul girişinde hatalar var gibi 
mesul birden fazla yurda mesulluk yapması gerekebilir yada bir mesul yurduda olmalı
hoca mesul olursa nasıl olur 

soruları rastgele dağıttı zaman önce daha az sorduğu soruyu getirmesi lazım
deneme analizde tarih koyulabilir
türkçe ing düzenlenebilir

analizler daha düzenli olabilir
mesul girişlerini kontrol edilmeli ->sınıfı ve yurdun sınıflarını görebilmeli
hoca ve mesule ait tema değişmeli 
talebe çalşası için deneme yerine ders çalışma ve deneme çözmek için yer olmalı

heroku buildpacks:clear


## Project Structure

Node is required for generation and recommended for development. `package.json` is always generated for a better development experience with prettier, commit hooks, scripts and so on.

In the project root, JHipster generates configuration files for tools like git, prettier, eslint, husk, and others that are well known and you can find references in the web.

`/src/*` structure follows default Java structure.

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if ommited) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files

- `npmw` - wrapper to use locally installed npm.
  JHipster installs Node and npm locally using the build tool by default. This wrapper makes sure npm is installed locally and uses it avoiding some differences different versions can cause. By using `./npmw` instead of the traditional `npm` you can configure a Node-less environment to develop or test your application.
- `/src/main/docker` - Docker configurations for the application and services that the application depends on

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```
npm install
```

We use npm scripts and [Angular CLI][] with [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```
./mvnw
npm start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is disabled by default. To enable it, uncomment the following code in `src/main/webapp/app/app.module.ts`:

```typescript
ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
```

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

```
npm install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

```
npm install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Edit [src/main/webapp/app/app.module.ts](src/main/webapp/app/app.module.ts) file:

```
import 'leaflet/dist/leaflet.js';
```

Edit [src/main/webapp/content/scss/vendor.scss](src/main/webapp/content/scss/vendor.scss) file:

```
@import '~leaflet/dist/leaflet.css';
```

Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

### Using Angular CLI

You can also use [Angular CLI][] to generate some custom client code.

For example, the following command:

```
ng generate component my-component
```

will generate few files:

```
create src/main/webapp/app/my-component/my-component.component.html
create src/main/webapp/app/my-component/my-component.component.ts
update src/main/webapp/app/app.module.ts
```

### JHipster Control Center

JHipster Control Center can help you manage and control your application(s). You can start a local control center server (accessible on http://localhost:7419) with:

```
docker-compose -f src/main/docker/jhipster-control-center.yml up
```

## Building for production

### Packaging as jar

To build the final jar and optimize the temrinMatik application for production, run:

```
./mvnw -Pprod clean verify
```

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

```
./mvnw -Pprod,war clean verify
```

## Testing

To launch your application's tests, run:

```
./mvnw verify
```

### Client tests

Unit tests are run by [Jest][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

```
npm test
```

For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

Note: we have turned off authentication in [src/main/docker/sonar.yml](src/main/docker/sonar.yml) for out of the box experience while trying out SonarQube, for real use cases turn it back on.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar
```

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a postgresql database in a docker container, run:

```
docker-compose -f src/main/docker/postgresql.yml up -d
```

To stop it and remove the container, run:

```
docker-compose -f src/main/docker/postgresql.yml down
```

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

```
./mvnw -Pprod verify jib:dockerBuild
```

Then run:

```
docker-compose -f src/main/docker/app.yml up -d
```

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 7.8.1 archive]: https://www.jhipster.tech
[using jhipster in development]: https://www.jhipster.tech/development/
[using docker and docker-compose]: https://www.jhipster.tech/docker-compose
[using jhipster in production]: https://www.jhipster.tech/production/
[running tests page]: https://www.jhipster.tech/running-tests/
[code quality page]: https://www.jhipster.tech/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/setting-up-ci/
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[webpack]: https://webpack.github.io/
[browsersync]: https://www.browsersync.io/
[jest]: https://facebook.github.io/jest/
[leaflet]: https://leafletjs.com/
[definitelytyped]: https://definitelytyped.org/
[angular cli]: https://cli.angular.io/
