import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KonuComponent } from '../list/konu.component';
import { KonuDetailComponent } from '../detail/konu-detail.component';
import { KonuUpdateComponent } from '../update/konu-update.component';
import { KonuRoutingResolveService } from './konu-routing-resolve.service';

const konuRoute: Routes = [
  {
    path: '',
    component: KonuComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KonuDetailComponent,
    resolve: {
      konu: KonuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KonuUpdateComponent,
    resolve: {
      konu: KonuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KonuUpdateComponent,
    resolve: {
      konu: KonuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(konuRoute)],
  exports: [RouterModule],
})
export class KonuRoutingModule {}
