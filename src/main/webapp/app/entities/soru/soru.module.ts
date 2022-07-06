import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SoruComponent } from './list/soru.component';
import { SoruDetailComponent } from './detail/soru-detail.component';
import { SoruUpdateComponent } from './update/soru-update.component';
import { SoruDeleteDialogComponent } from './delete/soru-delete-dialog.component';
import { SoruRoutingModule } from './route/soru-routing.module';

@NgModule({
  imports: [SharedModule, SoruRoutingModule],
  declarations: [SoruComponent, SoruDetailComponent, SoruUpdateComponent, SoruDeleteDialogComponent],
  entryComponents: [SoruDeleteDialogComponent],
})
export class SoruModule {}
