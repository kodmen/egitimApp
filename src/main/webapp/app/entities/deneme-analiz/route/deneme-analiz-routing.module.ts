import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DenemeAnalizComponent } from '../list/deneme-analiz.component';
import { DenemeAnalizDetailComponent } from '../detail/deneme-analiz-detail.component';
import { DenemeAnalizUpdateComponent } from '../update/deneme-analiz-update.component';
import { DenemeAnalizRoutingResolveService } from './deneme-analiz-routing-resolve.service';

const denemeAnalizRoute: Routes = [
  {
    path: '',
    component: DenemeAnalizComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DenemeAnalizDetailComponent,
    resolve: {
      denemeAnaliz: DenemeAnalizRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DenemeAnalizUpdateComponent,
    resolve: {
      denemeAnaliz: DenemeAnalizRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DenemeAnalizUpdateComponent,
    resolve: {
      denemeAnaliz: DenemeAnalizRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(denemeAnalizRoute)],
  exports: [RouterModule],
})
export class DenemeAnalizRoutingModule {}
