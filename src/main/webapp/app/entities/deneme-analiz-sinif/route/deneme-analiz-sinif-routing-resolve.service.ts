import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDenemeAnalizSinif, DenemeAnalizSinif } from '../deneme-analiz-sinif.model';
import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';

@Injectable({ providedIn: 'root' })
export class DenemeAnalizSinifRoutingResolveService implements Resolve<IDenemeAnalizSinif> {
  constructor(protected service: DenemeAnalizSinifService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDenemeAnalizSinif> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((denemeAnalizSinif: HttpResponse<DenemeAnalizSinif>) => {
          if (denemeAnalizSinif.body) {
            return of(denemeAnalizSinif.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DenemeAnalizSinif());
  }
}
