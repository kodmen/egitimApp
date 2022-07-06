import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISinif, Sinif } from '../sinif.model';
import { SinifService } from '../service/sinif.service';

@Injectable({ providedIn: 'root' })
export class SinifRoutingResolveService implements Resolve<ISinif> {
  constructor(protected service: SinifService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISinif> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sinif: HttpResponse<Sinif>) => {
          if (sinif.body) {
            return of(sinif.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Sinif());
  }
}
