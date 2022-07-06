import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDenemeAnaliz, DenemeAnaliz } from '../deneme-analiz.model';
import { DenemeAnalizService } from '../service/deneme-analiz.service';

@Injectable({ providedIn: 'root' })
export class DenemeAnalizRoutingResolveService implements Resolve<IDenemeAnaliz> {
  constructor(protected service: DenemeAnalizService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDenemeAnaliz> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((denemeAnaliz: HttpResponse<DenemeAnaliz>) => {
          if (denemeAnaliz.body) {
            return of(denemeAnaliz.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DenemeAnaliz());
  }
}
