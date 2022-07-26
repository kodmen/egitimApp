import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISinif, getSinifIdentifier } from '../sinif.model';

export type EntityResponseType = HttpResponse<ISinif>;
export type EntityArrayResponseType = HttpResponse<ISinif[]>;

@Injectable({ providedIn: 'root' })
export class SinifService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sinifs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getSinifByYurtId(id:number):Observable<EntityArrayResponseType> {
    return this.http.get<ISinif[]>(this.resourceUrl + `/yurt/${id}`, { observe: 'response' });
  }

  ogrSinifAta(id: number): Observable<EntityResponseType> {
    return this.http.get(this.resourceUrl+ `/yurt-ekle/${id}`, { observe: 'response' });
  }

  ogrenciSinifVarMi(): Observable<boolean> {
    return this.http.get<boolean>(this.resourceUrl+ `/user`);
  }

  create(sinif: ISinif): Observable<EntityResponseType> {
    return this.http.post<ISinif>(this.resourceUrl, sinif, { observe: 'response' });
  }

  update(sinif: ISinif): Observable<EntityResponseType> {
    return this.http.put<ISinif>(`${this.resourceUrl}/${getSinifIdentifier(sinif) as number}`, sinif, { observe: 'response' });
  }

  partialUpdate(sinif: ISinif): Observable<EntityResponseType> {
    return this.http.patch<ISinif>(`${this.resourceUrl}/${getSinifIdentifier(sinif) as number}`, sinif, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISinif>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISinif[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSinifToCollectionIfMissing(sinifCollection: ISinif[], ...sinifsToCheck: (ISinif | null | undefined)[]): ISinif[] {
    const sinifs: ISinif[] = sinifsToCheck.filter(isPresent);
    if (sinifs.length > 0) {
      const sinifCollectionIdentifiers = sinifCollection.map(sinifItem => getSinifIdentifier(sinifItem)!);
      const sinifsToAdd = sinifs.filter(sinifItem => {
        const sinifIdentifier = getSinifIdentifier(sinifItem);
        if (sinifIdentifier == null || sinifCollectionIdentifiers.includes(sinifIdentifier)) {
          return false;
        }
        sinifCollectionIdentifiers.push(sinifIdentifier);
        return true;
      });
      return [...sinifsToAdd, ...sinifCollection];
    }
    return sinifCollection;
  }
}
