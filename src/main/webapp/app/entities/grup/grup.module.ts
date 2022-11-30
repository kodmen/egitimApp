import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrupComponent } from './list/grup.component';
import { GrupDetailComponent } from './detail/grup-detail.component';
import { GrupUpdateComponent } from './update/grup-update.component';
import { GrupDeleteDialogComponent } from './delete/grup-delete-dialog.component';
import { GrupRoutingModule } from './route/grup-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [SharedModule, GrupRoutingModule,NgMultiSelectDropDownModule],
  declarations: [GrupComponent, GrupDetailComponent, GrupUpdateComponent, GrupDeleteDialogComponent],
  entryComponents: [GrupDeleteDialogComponent],
})
export class GrupModule {}
