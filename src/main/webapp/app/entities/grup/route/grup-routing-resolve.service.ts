import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrup, Grup } from '../grup.model';
import { GrupService } from '../service/grup.service';

@Injectable({ providedIn: 'root' })
export class GrupRoutingResolveService implements Resolve<IGrup> {
  constructor(protected service: GrupService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrup> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grup: HttpResponse<Grup>) => {
          if (grup.body) {
            return of(grup.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Grup());
  }
}
