import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KonuComponent } from './list/konu.component';
import { KonuDetailComponent } from './detail/konu-detail.component';
import { KonuUpdateComponent } from './update/konu-update.component';
import { KonuDeleteDialogComponent } from './delete/konu-delete-dialog.component';
import { KonuRoutingModule } from './route/konu-routing.module';

@NgModule({
  imports: [SharedModule, KonuRoutingModule],
  declarations: [KonuComponent, KonuDetailComponent, KonuUpdateComponent, KonuDeleteDialogComponent],
  entryComponents: [KonuDeleteDialogComponent],
})
export class KonuModule {}
