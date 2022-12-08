import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMesaj, Mesaj } from '../mesaj.model';
import { MesajService } from '../service/mesaj.service';

@Injectable({ providedIn: 'root' })
export class MesajRoutingResolveService implements Resolve<IMesaj> {
  constructor(protected service: MesajService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMesaj> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mesaj: HttpResponse<Mesaj>) => {
          if (mesaj.body) {
            return of(mesaj.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Mesaj());
  }
}
