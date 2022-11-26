import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DonemComponent } from '../list/donem.component';
import { DonemDetailComponent } from '../detail/donem-detail.component';
import { DonemUpdateComponent } from '../update/donem-update.component';
import { DonemRoutingResolveService } from './donem-routing-resolve.service';

const donemRoute: Routes = [
  {
    path: '',
    component: DonemComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DonemDetailComponent,
    resolve: {
      donem: DonemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DonemUpdateComponent,
    resolve: {
      donem: DonemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DonemUpdateComponent,
    resolve: {
      donem: DonemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(donemRoute)],
  exports: [RouterModule],
})
export class DonemRoutingModule {}
