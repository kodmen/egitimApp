import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DenemeComponent } from '../list/deneme.component';
import { DenemeDetailComponent } from '../detail/deneme-detail.component';
import { DenemeUpdateComponent } from '../update/deneme-update.component';
import { DenemeRoutingResolveService } from './deneme-routing-resolve.service';
import { CreateComponent } from '../create/create.component';
import { DenemeGirisComponent } from '../deneme-giris/deneme-giris.component';
import { OgrDenemeListComponent } from '../ogr-deneme-list/ogr-deneme-list.component';
import { DersCalisComponent } from '../ders-calis/ders-calis.component';

const denemeRoute: Routes = [
  {
    path: '',
    component: DenemeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DenemeDetailComponent,
    resolve: {
      deneme: DenemeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/basla',
    component: DenemeGirisComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'ders-calis',
    component: DersCalisComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'ogr',
    component: OgrDenemeListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreateComponent,
    resolve: {
      deneme: DenemeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DenemeUpdateComponent,
    resolve: {
      deneme: DenemeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(denemeRoute)],
  exports: [RouterModule],
})
export class DenemeRoutingModule {}
