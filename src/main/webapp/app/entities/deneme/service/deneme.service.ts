import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDeneme, getDenemeIdentifier } from '../deneme.model';
import { IDenemeDto } from '../denemeDto.model';
import { DenemeSinavDto } from '../deneme-giris/denemeSinav.model';
import { DenemeCevapRequest } from '../deneme-giris/denemeCevap.model';

export type EntityResponseType = HttpResponse<IDeneme>;
export type EntityArrayResponseType = HttpResponse<IDeneme[]>;

@Injectable({ providedIn: 'root' })
export class DenemeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/denemes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(deneme: IDeneme): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(deneme);
    return this.http
      .post<IDeneme>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  createDto(deneme: IDenemeDto): Observable<EntityResponseType> {
    // const copy = this.convertDateFromClient(deneme);
    return this.http.post<IDeneme>(this.resourceUrl, deneme, { observe: 'response' })
    .pipe(map((res: EntityResponseType) => this.convertDateDtoFromServer(res)));
  }


  getDenemeSinav(id: number): Observable<DenemeSinavDto> {
    return this.http.get<DenemeSinavDto>(`api/denemeSinva/${id}`);
  }

  cevaplariGonder(deneme: DenemeCevapRequest): Observable<number> {
    return this.http.post<number>(this.resourceUrl + '/cevaplar', deneme);
  }

  update(deneme: IDeneme): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(deneme);
    return this.http
      .put<IDeneme>(`${this.resourceUrl}/${getDenemeIdentifier(deneme) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(deneme: IDeneme): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(deneme);
    return this.http
      .patch<IDeneme>(`${this.resourceUrl}/${getDenemeIdentifier(deneme) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDeneme>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDeneme[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDenemeToCollectionIfMissing(denemeCollection: IDeneme[], ...denemesToCheck: (IDeneme | null | undefined)[]): IDeneme[] {
    const denemes: IDeneme[] = denemesToCheck.filter(isPresent);
    if (denemes.length > 0) {
      const denemeCollectionIdentifiers = denemeCollection.map(denemeItem => getDenemeIdentifier(denemeItem)!);
      const denemesToAdd = denemes.filter(denemeItem => {
        const denemeIdentifier = getDenemeIdentifier(denemeItem);
        if (denemeIdentifier == null || denemeCollectionIdentifiers.includes(denemeIdentifier)) {
          return false;
        }
        denemeCollectionIdentifiers.push(denemeIdentifier);
        return true;
      });
      return [...denemesToAdd, ...denemeCollection];
    }
    return denemeCollection;
  }

  protected convertDateFromClient(deneme: IDeneme): IDeneme {
    return Object.assign({}, deneme, {
      olusturmaTarih: deneme.olusturmaTarih?.isValid() ? deneme.olusturmaTarih.format(DATE_FORMAT) : undefined,
      baslamaTarih: deneme.baslamaTarih?.isValid() ? deneme.baslamaTarih.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.olusturmaTarih = res.body.olusturmaTarih ? dayjs(res.body.olusturmaTarih) : undefined;
      res.body.baslamaTarih = res.body.baslamaTarih ? dayjs(res.body.baslamaTarih) : undefined;
    }
    return res;
  }

  protected convertDateDtoFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.baslamaTarih = res.body.baslamaTarih ? dayjs(res.body.baslamaTarih) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((deneme: IDeneme) => {
        deneme.olusturmaTarih = deneme.olusturmaTarih ? dayjs(deneme.olusturmaTarih) : undefined;
        deneme.baslamaTarih = deneme.baslamaTarih ? dayjs(deneme.baslamaTarih).locale('tr')  : undefined;
      });
    }
    return res;
  }
}
