import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HocaOlusturComponent } from './hoca-olustur/hoca-olustur.component';
import { SharedModule } from 'app/shared/shared.module';
import { userManagementRoute } from './user-management.route';
import { RouterModule } from '@angular/router';
import { UpdateComponent } from './update/update.component';



@NgModule({
  declarations: [
    HocaOlusturComponent,
    UpdateComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(userManagementRoute),
    CommonModule
  ]
})
export class UserManagmentModule { }
