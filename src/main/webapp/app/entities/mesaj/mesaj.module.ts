import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MesajComponent } from './list/mesaj.component';
import { MesajDetailComponent } from './detail/mesaj-detail.component';
import { MesajUpdateComponent } from './update/mesaj-update.component';
import { MesajDeleteDialogComponent } from './delete/mesaj-delete-dialog.component';
import { MesajRoutingModule } from './route/mesaj-routing.module';
import { UserMesajOlusturComponent } from './user-mesaj-olustur/user-mesaj-olustur.component';

@NgModule({
  imports: [SharedModule, MesajRoutingModule],
  declarations: [MesajComponent, MesajDetailComponent, MesajUpdateComponent, MesajDeleteDialogComponent, UserMesajOlusturComponent],
  entryComponents: [MesajDeleteDialogComponent],
})
export class MesajModule {}
