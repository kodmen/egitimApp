import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DenemeAnalizSinifComponent } from './list/deneme-analiz-sinif.component';
import { DenemeAnalizSinifDetailComponent } from './detail/deneme-analiz-sinif-detail.component';
import { DenemeAnalizSinifUpdateComponent } from './update/deneme-analiz-sinif-update.component';
import { DenemeAnalizSinifDeleteDialogComponent } from './delete/deneme-analiz-sinif-delete-dialog.component';
import { DenemeAnalizSinifRoutingModule } from './route/deneme-analiz-sinif-routing.module';
import { HocaOgrListComponent } from './hoca-ogr-list/hoca-ogr-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [SharedModule, DenemeAnalizSinifRoutingModule,NgMultiSelectDropDownModule],
  declarations: [
    DenemeAnalizSinifComponent,
    DenemeAnalizSinifDetailComponent,
    DenemeAnalizSinifUpdateComponent,
    DenemeAnalizSinifDeleteDialogComponent,
    HocaOgrListComponent,
  ],
  entryComponents: [DenemeAnalizSinifDeleteDialogComponent],
})
export class DenemeAnalizSinifModule {}
