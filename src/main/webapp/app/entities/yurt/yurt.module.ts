import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { YurtComponent } from './list/yurt.component';
import { YurtDetailComponent } from './detail/yurt-detail.component';
import { YurtUpdateComponent } from './update/yurt-update.component';
import { YurtDeleteDialogComponent } from './delete/yurt-delete-dialog.component';
import { YurtRoutingModule } from './route/yurt-routing.module';

@NgModule({
  imports: [SharedModule, YurtRoutingModule],
  declarations: [YurtComponent, YurtDetailComponent, YurtUpdateComponent, YurtDeleteDialogComponent],
  entryComponents: [YurtDeleteDialogComponent],
})
export class YurtModule {}
