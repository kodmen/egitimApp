import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IYurt, Yurt } from '../yurt.model';
import { YurtService } from '../service/yurt.service';

@Injectable({ providedIn: 'root' })
export class YurtRoutingResolveService implements Resolve<IYurt> {
  constructor(protected service: YurtService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IYurt> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((yurt: HttpResponse<Yurt>) => {
          if (yurt.body) {
            return of(yurt.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Yurt());
  }
}
