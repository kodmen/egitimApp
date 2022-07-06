import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDeneme, Deneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';

@Injectable({ providedIn: 'root' })
export class DenemeRoutingResolveService implements Resolve<IDeneme> {
  constructor(protected service: DenemeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDeneme> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((deneme: HttpResponse<Deneme>) => {
          if (deneme.body) {
            return of(deneme.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Deneme());
  }
}
