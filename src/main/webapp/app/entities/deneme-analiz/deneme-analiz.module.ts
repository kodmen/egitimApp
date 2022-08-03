import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DenemeAnalizComponent } from './list/deneme-analiz.component';
import { DenemeAnalizDetailComponent } from './detail/deneme-analiz-detail.component';
import { DenemeAnalizUpdateComponent } from './update/deneme-analiz-update.component';
import { DenemeAnalizDeleteDialogComponent } from './delete/deneme-analiz-delete-dialog.component';
import { DenemeAnalizRoutingModule } from './route/deneme-analiz-routing.module';
import { SiralamaComponent } from './siralama/siralama.component';

@NgModule({
  imports: [SharedModule, DenemeAnalizRoutingModule],
  declarations: [DenemeAnalizComponent, DenemeAnalizDetailComponent, DenemeAnalizUpdateComponent, DenemeAnalizDeleteDialogComponent, SiralamaComponent],
  entryComponents: [DenemeAnalizDeleteDialogComponent],
})
export class DenemeAnalizModule {}
