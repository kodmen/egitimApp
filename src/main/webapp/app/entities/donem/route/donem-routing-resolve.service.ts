import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDonem, Donem } from '../donem.model';
import { DonemService } from '../service/donem.service';

@Injectable({ providedIn: 'root' })
export class DonemRoutingResolveService implements Resolve<IDonem> {
  constructor(protected service: DonemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDonem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((donem: HttpResponse<Donem>) => {
          if (donem.body) {
            return of(donem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Donem());
  }
}
