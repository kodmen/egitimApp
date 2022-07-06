import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDenemeAnalizSinif, getDenemeAnalizSinifIdentifier } from '../deneme-analiz-sinif.model';

export type EntityResponseType = HttpResponse<IDenemeAnalizSinif>;
export type EntityArrayResponseType = HttpResponse<IDenemeAnalizSinif[]>;

@Injectable({ providedIn: 'root' })
export class DenemeAnalizSinifService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/deneme-analiz-sinifs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(denemeAnalizSinif: IDenemeAnalizSinif): Observable<EntityResponseType> {
    return this.http.post<IDenemeAnalizSinif>(this.resourceUrl, denemeAnalizSinif, { observe: 'response' });
  }

  update(denemeAnalizSinif: IDenemeAnalizSinif): Observable<EntityResponseType> {
    return this.http.put<IDenemeAnalizSinif>(
      `${this.resourceUrl}/${getDenemeAnalizSinifIdentifier(denemeAnalizSinif) as number}`,
      denemeAnalizSinif,
      { observe: 'response' }
    );
  }

  partialUpdate(denemeAnalizSinif: IDenemeAnalizSinif): Observable<EntityResponseType> {
    return this.http.patch<IDenemeAnalizSinif>(
      `${this.resourceUrl}/${getDenemeAnalizSinifIdentifier(denemeAnalizSinif) as number}`,
      denemeAnalizSinif,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDenemeAnalizSinif>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDenemeAnalizSinif[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDenemeAnalizSinifToCollectionIfMissing(
    denemeAnalizSinifCollection: IDenemeAnalizSinif[],
    ...denemeAnalizSinifsToCheck: (IDenemeAnalizSinif | null | undefined)[]
  ): IDenemeAnalizSinif[] {
    const denemeAnalizSinifs: IDenemeAnalizSinif[] = denemeAnalizSinifsToCheck.filter(isPresent);
    if (denemeAnalizSinifs.length > 0) {
      const denemeAnalizSinifCollectionIdentifiers = denemeAnalizSinifCollection.map(
        denemeAnalizSinifItem => getDenemeAnalizSinifIdentifier(denemeAnalizSinifItem)!
      );
      const denemeAnalizSinifsToAdd = denemeAnalizSinifs.filter(denemeAnalizSinifItem => {
        const denemeAnalizSinifIdentifier = getDenemeAnalizSinifIdentifier(denemeAnalizSinifItem);
        if (denemeAnalizSinifIdentifier == null || denemeAnalizSinifCollectionIdentifiers.includes(denemeAnalizSinifIdentifier)) {
          return false;
        }
        denemeAnalizSinifCollectionIdentifiers.push(denemeAnalizSinifIdentifier);
        return true;
      });
      return [...denemeAnalizSinifsToAdd, ...denemeAnalizSinifCollection];
    }
    return denemeAnalizSinifCollection;
  }
}
