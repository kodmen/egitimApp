import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { UserManagementService } from 'app/admin/user-management/service/user-management.service';
import { User } from 'app/admin/user-management/user-management.model';
import { IUser } from 'app/entities/user/user.model';
import { Observable, of } from 'rxjs';
import { HocaOlusturComponent } from './hoca-olustur/hoca-olustur.component';
import { UpdateComponent } from './update/update.component';


@Injectable({ providedIn: 'root' })
export class UserManagementResolve implements Resolve<IUser> {
  constructor(private service: UserManagementService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser> {
    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(new User());
  }
}

export const userManagementRoute: Routes = [
  {
    path: '',
    component: HocaOlusturComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: ':login/edit',
    component: UpdateComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },

 
];
