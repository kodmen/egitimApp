import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SinifComponent } from '../list/sinif.component';
import { SinifDetailComponent } from '../detail/sinif-detail.component';
import { SinifUpdateComponent } from '../update/sinif-update.component';
import { SinifRoutingResolveService } from './sinif-routing-resolve.service';

const sinifRoute: Routes = [
  {
    path: '',
    component: SinifComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SinifDetailComponent,
    resolve: {
      sinif: SinifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SinifUpdateComponent,
    resolve: {
      sinif: SinifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SinifUpdateComponent,
    resolve: {
      sinif: SinifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sinifRoute)],
  exports: [RouterModule],
})
export class SinifRoutingModule {}
