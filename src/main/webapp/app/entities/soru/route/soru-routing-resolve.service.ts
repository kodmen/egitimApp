import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISoru, Soru } from '../soru.model';
import { SoruService } from '../service/soru.service';

@Injectable({ providedIn: 'root' })
export class SoruRoutingResolveService implements Resolve<ISoru> {
  constructor(protected service: SoruService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISoru> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((soru: HttpResponse<Soru>) => {
          if (soru.body) {
            return of(soru.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Soru());
  }
}
