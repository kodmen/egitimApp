import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IYurt, getYurtIdentifier } from '../yurt.model';

export type EntityResponseType = HttpResponse<IYurt>;
export type EntityArrayResponseType = HttpResponse<IYurt[]>;

@Injectable({ providedIn: 'root' })
export class YurtService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/yurts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(yurt: IYurt): Observable<EntityResponseType> {
    return this.http.post<IYurt>(this.resourceUrl, yurt, { observe: 'response' });
  }

  update(yurt: IYurt): Observable<EntityResponseType> {
    return this.http.put<IYurt>(`${this.resourceUrl}/${getYurtIdentifier(yurt) as number}`, yurt, { observe: 'response' });
  }

  partialUpdate(yurt: IYurt): Observable<EntityResponseType> {
    return this.http.patch<IYurt>(`${this.resourceUrl}/${getYurtIdentifier(yurt) as number}`, yurt, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IYurt>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IYurt[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addYurtToCollectionIfMissing(yurtCollection: IYurt[], ...yurtsToCheck: (IYurt | null | undefined)[]): IYurt[] {
    const yurts: IYurt[] = yurtsToCheck.filter(isPresent);
    if (yurts.length > 0) {
      const yurtCollectionIdentifiers = yurtCollection.map(yurtItem => getYurtIdentifier(yurtItem)!);
      const yurtsToAdd = yurts.filter(yurtItem => {
        const yurtIdentifier = getYurtIdentifier(yurtItem);
        if (yurtIdentifier == null || yurtCollectionIdentifiers.includes(yurtIdentifier)) {
          return false;
        }
        yurtCollectionIdentifiers.push(yurtIdentifier);
        return true;
      });
      return [...yurtsToAdd, ...yurtCollection];
    }
    return yurtCollection;
  }
}
