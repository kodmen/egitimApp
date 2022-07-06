import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKonu, Konu } from '../konu.model';
import { KonuService } from '../service/konu.service';

@Injectable({ providedIn: 'root' })
export class KonuRoutingResolveService implements Resolve<IKonu> {
  constructor(protected service: KonuService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKonu> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((konu: HttpResponse<Konu>) => {
          if (konu.body) {
            return of(konu.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Konu());
  }
}
