import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MesajComponent } from '../list/mesaj.component';
import { MesajDetailComponent } from '../detail/mesaj-detail.component';
import { MesajUpdateComponent } from '../update/mesaj-update.component';
import { MesajRoutingResolveService } from './mesaj-routing-resolve.service';
import { UserMesajOlusturComponent } from '../user-mesaj-olustur/user-mesaj-olustur.component';

const mesajRoute: Routes = [
  {
    path: '',
    component: MesajComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MesajDetailComponent,
    resolve: {
      mesaj: MesajRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MesajUpdateComponent,
    resolve: {
      mesaj: MesajRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'iletisim',
    component: UserMesajOlusturComponent,
    resolve: {
      mesaj: MesajRoutingResolveService,
    }
  },
  {
    path: ':id/edit',
    component: MesajUpdateComponent,
    resolve: {
      mesaj: MesajRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mesajRoute)],
  exports: [RouterModule],
})
export class MesajRoutingModule {}
