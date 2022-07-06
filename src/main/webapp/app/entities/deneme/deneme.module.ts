import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DenemeComponent } from './list/deneme.component';
import { DenemeDetailComponent } from './detail/deneme-detail.component';
import { DenemeUpdateComponent } from './update/deneme-update.component';
import { DenemeDeleteDialogComponent } from './delete/deneme-delete-dialog.component';
import { DenemeRoutingModule } from './route/deneme-routing.module';
import { CreateComponent } from './create/create.component';
import { DenemeGirisComponent } from './deneme-giris/deneme-giris.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OgrDenemeListComponent } from './ogr-deneme-list/ogr-deneme-list.component';

@NgModule({
  imports: [SharedModule, DenemeRoutingModule,NgxPaginationModule],
  declarations: [DenemeComponent, DenemeDetailComponent, DenemeUpdateComponent, DenemeDeleteDialogComponent, CreateComponent, DenemeGirisComponent, OgrDenemeListComponent],
  entryComponents: [DenemeDeleteDialogComponent],
})
export class DenemeModule {}
