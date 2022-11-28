import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SoruComponent } from './list/soru.component';
import { SoruDetailComponent } from './detail/soru-detail.component';
import { SoruUpdateComponent } from './update/soru-update.component';
import { SoruDeleteDialogComponent } from './delete/soru-delete-dialog.component';
import { SoruRoutingModule } from './route/soru-routing.module';
import { TekSoruComponent } from './tek-soru/tek-soru.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ListKonuComponent } from './list-konu/list-konu.component'; // <-- import it

@NgModule({
  imports: [SharedModule, SoruRoutingModule,LazyLoadImageModule],
  declarations: [SoruComponent, SoruDetailComponent, SoruUpdateComponent, SoruDeleteDialogComponent, TekSoruComponent, ListKonuComponent],
  entryComponents: [SoruDeleteDialogComponent],
})
export class SoruModule {}
