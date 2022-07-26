import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SinifComponent } from './list/sinif.component';
import { SinifDetailComponent } from './detail/sinif-detail.component';
import { SinifUpdateComponent } from './update/sinif-update.component';
import { SinifDeleteDialogComponent } from './delete/sinif-delete-dialog.component';
import { SinifRoutingModule } from './route/sinif-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OgrSinifEkleComponent } from './ogr-sinif-ekle/ogr-sinif-ekle.component';

@NgModule({
  imports: [SharedModule, SinifRoutingModule,NgMultiSelectDropDownModule.forRoot()],
  declarations: [SinifComponent, SinifDetailComponent, SinifUpdateComponent, SinifDeleteDialogComponent, OgrSinifEkleComponent],
  entryComponents: [SinifDeleteDialogComponent],
})
export class SinifModule {}
