import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DonemComponent } from './list/donem.component';
import { DonemDetailComponent } from './detail/donem-detail.component';
import { DonemUpdateComponent } from './update/donem-update.component';
import { DonemDeleteDialogComponent } from './delete/donem-delete-dialog.component';
import { DonemRoutingModule } from './route/donem-routing.module';

@NgModule({
  imports: [SharedModule, DonemRoutingModule],
  declarations: [DonemComponent, DonemDetailComponent, DonemUpdateComponent, DonemDeleteDialogComponent],
  entryComponents: [DonemDeleteDialogComponent],
})
export class DonemModule {}
