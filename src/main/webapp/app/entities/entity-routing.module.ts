import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'yurt',
        data: { pageTitle: 'temrinMatikApp.yurt.home.title' },
        loadChildren: () => import('./yurt/yurt.module').then(m => m.YurtModule),
      },
      {
        path: 'grup',
        data: { pageTitle: 'temrinMatikApp.grup.home.title' },
        loadChildren: () => import('./grup/grup.module').then(m => m.GrupModule),
      },
      {
        path: 'konu',
        data: { pageTitle: 'temrinMatikApp.konu.home.title' },
        loadChildren: () => import('./konu/konu.module').then(m => m.KonuModule),
      },
      {
        path: 'soru',
        data: { pageTitle: 'temrinMatikApp.soru.home.title' },
        loadChildren: () => import('./soru/soru.module').then(m => m.SoruModule),
      },
      {
        path: 'sinif',
        data: { pageTitle: 'temrinMatikApp.sinif.home.title' },
        loadChildren: () => import('./sinif/sinif.module').then(m => m.SinifModule),
      },
      {
        path: 'deneme-analiz-sinif',
        data: { pageTitle: 'temrinMatikApp.denemeAnalizSinif.home.title' },
        loadChildren: () => import('./deneme-analiz-sinif/deneme-analiz-sinif.module').then(m => m.DenemeAnalizSinifModule),
      },
      {
        path: 'deneme-analiz',
        data: { pageTitle: 'temrinMatikApp.denemeAnaliz.home.title' },
        loadChildren: () => import('./deneme-analiz/deneme-analiz.module').then(m => m.DenemeAnalizModule),
      },
      {
        path: 'deneme',
        data: { pageTitle: 'temrinMatikApp.deneme.home.title' },
        loadChildren: () => import('./deneme/deneme.module').then(m => m.DenemeModule),
      },
      {
        path: 'donem',
        data: { pageTitle: 'temrinMatikApp.donem.home.title' },
        loadChildren: () => import('./donem/donem.module').then(m => m.DonemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
