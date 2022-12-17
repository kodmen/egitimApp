import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'user-management',
        loadChildren: () => import('./user-managment/user-managment.module').then(m => m.UserManagmentModule),
        data: {
          pageTitle: 'userManagement.home.title',
        },
      },   
    ]),
  ],
})
export class MesulRoutingModule {}
