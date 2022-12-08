import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMesaj, getMesajIdentifier } from '../mesaj.model';

export type EntityResponseType = HttpResponse<IMesaj>;
export type EntityArrayResponseType = HttpResponse<IMesaj[]>;

@Injectable({ providedIn: 'root' })
export class MesajService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mesajs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mesaj: IMesaj): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mesaj);
    return this.http
      .post<IMesaj>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  createMesajForUser(mesaj: IMesaj): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mesaj);
    return this.http
      .post<IMesaj>(this.resourceUrl+"/kullanici", copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(mesaj: IMesaj): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mesaj);
    return this.http
      .put<IMesaj>(`${this.resourceUrl}/${getMesajIdentifier(mesaj) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(mesaj: IMesaj): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mesaj);
    return this.http
      .patch<IMesaj>(`${this.resourceUrl}/${getMesajIdentifier(mesaj) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMesaj>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMesaj[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMesajToCollectionIfMissing(mesajCollection: IMesaj[], ...mesajsToCheck: (IMesaj | null | undefined)[]): IMesaj[] {
    const mesajs: IMesaj[] = mesajsToCheck.filter(isPresent);
    if (mesajs.length > 0) {
      const mesajCollectionIdentifiers = mesajCollection.map(mesajItem => getMesajIdentifier(mesajItem)!);
      const mesajsToAdd = mesajs.filter(mesajItem => {
        const mesajIdentifier = getMesajIdentifier(mesajItem);
        if (mesajIdentifier == null || mesajCollectionIdentifiers.includes(mesajIdentifier)) {
          return false;
        }
        mesajCollectionIdentifiers.push(mesajIdentifier);
        return true;
      });
      return [...mesajsToAdd, ...mesajCollection];
    }
    return mesajCollection;
  }

  protected convertDateFromClient(mesaj: IMesaj): IMesaj {
    return Object.assign({}, mesaj, {
      tarih: mesaj.tarih?.isValid() ? mesaj.tarih.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.tarih = res.body.tarih ? dayjs(res.body.tarih) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((mesaj: IMesaj) => {
        mesaj.tarih = mesaj.tarih ? dayjs(mesaj.tarih) : undefined;
      });
    }
    return res;
  }
}
