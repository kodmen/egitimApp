import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISoru, getSoruIdentifier } from '../soru.model';

export type EntityResponseType = HttpResponse<ISoru>;
export type EntityArrayResponseType = HttpResponse<ISoru[]>;

@Injectable({ providedIn: 'root' })
export class SoruService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sorus');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getSoruByKonu(konuID:number):Observable<EntityArrayResponseType>{
    return this.http.get<ISoru[]>(this.resourceUrl + `/konu/${konuID}`, {  observe: 'response' });
  }

  getSoruByIsim(isim:string):Observable<EntityResponseType>{
    return this.http.get<ISoru>(this.resourceUrl + `/isim/${isim}`, {  observe: 'response' });
  }

  create(soru: ISoru): Observable<EntityResponseType> {
    return this.http.post<ISoru>(this.resourceUrl, soru, { observe: 'response' });
  }

  update(soru: ISoru): Observable<EntityResponseType> {
    return this.http.put<ISoru>(`${this.resourceUrl}/${getSoruIdentifier(soru) as number}`, soru, { observe: 'response' });
  }

  partialUpdate(soru: ISoru): Observable<EntityResponseType> {
    return this.http.patch<ISoru>(`${this.resourceUrl}/${getSoruIdentifier(soru) as number}`, soru, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISoru>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISoru[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSoruToCollectionIfMissing(soruCollection: ISoru[], ...sorusToCheck: (ISoru | null | undefined)[]): ISoru[] {
    const sorus: ISoru[] = sorusToCheck.filter(isPresent);
    if (sorus.length > 0) {
      const soruCollectionIdentifiers = soruCollection.map(soruItem => getSoruIdentifier(soruItem)!);
      const sorusToAdd = sorus.filter(soruItem => {
        const soruIdentifier = getSoruIdentifier(soruItem);
        if (soruIdentifier == null || soruCollectionIdentifiers.includes(soruIdentifier)) {
          return false;
        }
        soruCollectionIdentifiers.push(soruIdentifier);
        return true;
      });
      return [...sorusToAdd, ...soruCollection];
    }
    return soruCollection;
  }
}
