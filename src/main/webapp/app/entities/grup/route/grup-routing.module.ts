import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrupComponent } from '../list/grup.component';
import { GrupDetailComponent } from '../detail/grup-detail.component';
import { GrupUpdateComponent } from '../update/grup-update.component';
import { GrupRoutingResolveService } from './grup-routing-resolve.service';

const grupRoute: Routes = [
  {
    path: '',
    component: GrupComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrupDetailComponent,
    resolve: {
      grup: GrupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrupUpdateComponent,
    resolve: {
      grup: GrupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrupUpdateComponent,
    resolve: {
      grup: GrupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grupRoute)],
  exports: [RouterModule],
})
export class GrupRoutingModule {}
