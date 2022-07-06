import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { YurtComponent } from '../list/yurt.component';
import { YurtDetailComponent } from '../detail/yurt-detail.component';
import { YurtUpdateComponent } from '../update/yurt-update.component';
import { YurtRoutingResolveService } from './yurt-routing-resolve.service';

const yurtRoute: Routes = [
  {
    path: '',
    component: YurtComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: YurtDetailComponent,
    resolve: {
      yurt: YurtRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: YurtUpdateComponent,
    resolve: {
      yurt: YurtRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: YurtUpdateComponent,
    resolve: {
      yurt: YurtRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(yurtRoute)],
  exports: [RouterModule],
})
export class YurtRoutingModule {}
