import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKonu, getKonuIdentifier } from '../konu.model';

export type EntityResponseType = HttpResponse<IKonu>;
export type EntityArrayResponseType = HttpResponse<IKonu[]>;

@Injectable({ providedIn: 'root' })
export class KonuService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/konus');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  findByGrupId(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IKonu[]>(`${this.resourceUrl}/grup/${id}`, { observe: 'response' });
  }

  queryPage(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKonu[]>(this.resourceUrl+"/page", { params: options, observe: 'response' });
  }

  create(konu: IKonu): Observable<EntityResponseType> {
    return this.http.post<IKonu>(this.resourceUrl, konu, { observe: 'response' });
  }

  update(konu: IKonu): Observable<EntityResponseType> {
    return this.http.put<IKonu>(`${this.resourceUrl}/${getKonuIdentifier(konu) as number}`, konu, { observe: 'response' });
  }

  partialUpdate(konu: IKonu): Observable<EntityResponseType> {
    return this.http.patch<IKonu>(`${this.resourceUrl}/${getKonuIdentifier(konu) as number}`, konu, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IKonu>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKonu[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addKonuToCollectionIfMissing(konuCollection: IKonu[], ...konusToCheck: (IKonu | null | undefined)[]): IKonu[] {
    const konus: IKonu[] = konusToCheck.filter(isPresent);
    if (konus.length > 0) {
      const konuCollectionIdentifiers = konuCollection.map(konuItem => getKonuIdentifier(konuItem)!);
      const konusToAdd = konus.filter(konuItem => {
        const konuIdentifier = getKonuIdentifier(konuItem);
        if (konuIdentifier == null || konuCollectionIdentifiers.includes(konuIdentifier)) {
          return false;
        }
        konuCollectionIdentifiers.push(konuIdentifier);
        return true;
      });
      return [...konusToAdd, ...konuCollection];
    }
    return konuCollection;
  }
}
