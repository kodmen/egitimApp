import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDenemeAnaliz, getDenemeAnalizIdentifier } from '../deneme-analiz.model';
import { getDenemeIdentifier, IDeneme } from 'app/entities/deneme/deneme.model';

export type EntityResponseType = HttpResponse<IDenemeAnaliz>;
export type EntityArrayResponseType = HttpResponse<IDenemeAnaliz[]>;

@Injectable({ providedIn: 'root' })
export class DenemeAnalizService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deneme-analizs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(denemeAnaliz: IDenemeAnaliz): Observable<EntityResponseType> {
    return this.http.post<IDenemeAnaliz>(this.resourceUrl, denemeAnaliz, { observe: 'response' });
  }

  findDenemeyeGoreAnalizler(deneme:number | null | undefined): Observable<EntityArrayResponseType> {
    return this.http.get<IDenemeAnaliz[]>(`${this.resourceUrl}/hoca/${deneme}`, { observe: 'response' });
  }

  update(denemeAnaliz: IDenemeAnaliz): Observable<EntityResponseType> {
    return this.http.put<IDenemeAnaliz>(`${this.resourceUrl}/${getDenemeAnalizIdentifier(denemeAnaliz) as number}`, denemeAnaliz, {
      observe: 'response',
    });
  }

  partialUpdate(denemeAnaliz: IDenemeAnaliz): Observable<EntityResponseType> {
    return this.http.patch<IDenemeAnaliz>(`${this.resourceUrl}/${getDenemeAnalizIdentifier(denemeAnaliz) as number}`, denemeAnaliz, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDenemeAnaliz>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDenemeAnaliz[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDenemeAnalizToCollectionIfMissing(
    denemeAnalizCollection: IDenemeAnaliz[],
    ...denemeAnalizsToCheck: (IDenemeAnaliz | null | undefined)[]
  ): IDenemeAnaliz[] {
    const denemeAnalizs: IDenemeAnaliz[] = denemeAnalizsToCheck.filter(isPresent);
    if (denemeAnalizs.length > 0) {
      const denemeAnalizCollectionIdentifiers = denemeAnalizCollection.map(
        denemeAnalizItem => getDenemeAnalizIdentifier(denemeAnalizItem)!
      );
      const denemeAnalizsToAdd = denemeAnalizs.filter(denemeAnalizItem => {
        const denemeAnalizIdentifier = getDenemeAnalizIdentifier(denemeAnalizItem);
        if (denemeAnalizIdentifier == null || denemeAnalizCollectionIdentifiers.includes(denemeAnalizIdentifier)) {
          return false;
        }
        denemeAnalizCollectionIdentifiers.push(denemeAnalizIdentifier);
        return true;
      });
      return [...denemeAnalizsToAdd, ...denemeAnalizCollection];
    }
    return denemeAnalizCollection;
  }
}
