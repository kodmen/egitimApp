import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DenemeAnalizSinifComponent } from '../list/deneme-analiz-sinif.component';
import { DenemeAnalizSinifDetailComponent } from '../detail/deneme-analiz-sinif-detail.component';
import { DenemeAnalizSinifUpdateComponent } from '../update/deneme-analiz-sinif-update.component';
import { DenemeAnalizSinifRoutingResolveService } from './deneme-analiz-sinif-routing-resolve.service';

const denemeAnalizSinifRoute: Routes = [
  {
    path: '',
    component: DenemeAnalizSinifComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DenemeAnalizSinifDetailComponent,
    resolve: {
      denemeAnalizSinif: DenemeAnalizSinifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DenemeAnalizSinifUpdateComponent,
    resolve: {
      denemeAnalizSinif: DenemeAnalizSinifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DenemeAnalizSinifUpdateComponent,
    resolve: {
      denemeAnalizSinif: DenemeAnalizSinifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(denemeAnalizSinifRoute)],
  exports: [RouterModule],
})
export class DenemeAnalizSinifRoutingModule {}
