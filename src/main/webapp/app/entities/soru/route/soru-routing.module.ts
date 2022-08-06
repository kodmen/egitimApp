import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SoruComponent } from '../list/soru.component';
import { SoruDetailComponent } from '../detail/soru-detail.component';
import { SoruUpdateComponent } from '../update/soru-update.component';
import { SoruRoutingResolveService } from './soru-routing-resolve.service';
import { TekSoruComponent } from '../tek-soru/tek-soru.component';

const soruRoute: Routes = [
  {
    path: '',
    component: SoruComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SoruDetailComponent,
    resolve: {
      soru: SoruRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'isim/:isim',
    component: TekSoruComponent,
    resolve: {
      soru: SoruRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SoruUpdateComponent,
    resolve: {
      soru: SoruRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SoruUpdateComponent,
    resolve: {
      soru: SoruRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(soruRoute)],
  exports: [RouterModule],
})
export class SoruRoutingModule {}
