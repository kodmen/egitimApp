import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrup, getGrupIdentifier } from '../grup.model';

export type EntityResponseType = HttpResponse<IGrup>;
export type EntityArrayResponseType = HttpResponse<IGrup[]>;

@Injectable({ providedIn: 'root' })
export class GrupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grup: IGrup): Observable<EntityResponseType> {
    return this.http.post<IGrup>(this.resourceUrl, grup, { observe: 'response' });
  }

  update(grup: IGrup): Observable<EntityResponseType> {
    return this.http.put<IGrup>(`${this.resourceUrl}/${getGrupIdentifier(grup) as number}`, grup, { observe: 'response' });
  }

  partialUpdate(grup: IGrup): Observable<EntityResponseType> {
    return this.http.patch<IGrup>(`${this.resourceUrl}/${getGrupIdentifier(grup) as number}`, grup, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGrupToCollectionIfMissing(grupCollection: IGrup[], ...grupsToCheck: (IGrup | null | undefined)[]): IGrup[] {
    const grups: IGrup[] = grupsToCheck.filter(isPresent);
    if (grups.length > 0) {
      const grupCollectionIdentifiers = grupCollection.map(grupItem => getGrupIdentifier(grupItem)!);
      const grupsToAdd = grups.filter(grupItem => {
        const grupIdentifier = getGrupIdentifier(grupItem);
        if (grupIdentifier == null || grupCollectionIdentifiers.includes(grupIdentifier)) {
          return false;
        }
        grupCollectionIdentifiers.push(grupIdentifier);
        return true;
      });
      return [...grupsToAdd, ...grupCollection];
    }
    return grupCollection;
  }
}
