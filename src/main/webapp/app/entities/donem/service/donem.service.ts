import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDonem, getDonemIdentifier } from '../donem.model';

export type EntityResponseType = HttpResponse<IDonem>;
export type EntityArrayResponseType = HttpResponse<IDonem[]>;

@Injectable({ providedIn: 'root' })
export class DonemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/donems');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(donem: IDonem): Observable<EntityResponseType> {
    return this.http.post<IDonem>(this.resourceUrl, donem, { observe: 'response' });
  }

  update(donem: IDonem): Observable<EntityResponseType> {
    return this.http.put<IDonem>(`${this.resourceUrl}/${getDonemIdentifier(donem) as number}`, donem, { observe: 'response' });
  }

  partialUpdate(donem: IDonem): Observable<EntityResponseType> {
    return this.http.patch<IDonem>(`${this.resourceUrl}/${getDonemIdentifier(donem) as number}`, donem, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDonem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDonem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDonemToCollectionIfMissing(donemCollection: IDonem[], ...donemsToCheck: (IDonem | null | undefined)[]): IDonem[] {
    const donems: IDonem[] = donemsToCheck.filter(isPresent);
    if (donems.length > 0) {
      const donemCollectionIdentifiers = donemCollection.map(donemItem => getDonemIdentifier(donemItem)!);
      const donemsToAdd = donems.filter(donemItem => {
        const donemIdentifier = getDonemIdentifier(donemItem);
        if (donemIdentifier == null || donemCollectionIdentifiers.includes(donemIdentifier)) {
          return false;
        }
        donemCollectionIdentifiers.push(donemIdentifier);
        return true;
      });
      return [...donemsToAdd, ...donemCollection];
    }
    return donemCollection;
  }
}
