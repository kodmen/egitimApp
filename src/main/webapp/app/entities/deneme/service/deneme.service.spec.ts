import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDeneme, Deneme } from '../deneme.model';

import { DenemeService } from './deneme.service';

describe('Deneme Service', () => {
  let service: DenemeService;
  let httpMock: HttpTestingController;
  let elemDefault: IDeneme;
  let expectedResult: IDeneme | IDeneme[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DenemeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      isim: 'AAAAAAA',
      olusturmaTarih: currentDate,
      baslamaTarih: currentDate,
      sure: 0,
      cevapAnahtar: 'AAAAAAA',
      denemeInfoJson: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          olusturmaTarih: currentDate.format(DATE_FORMAT),
          baslamaTarih: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Deneme', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          olusturmaTarih: currentDate.format(DATE_FORMAT),
          baslamaTarih: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          olusturmaTarih: currentDate,
          baslamaTarih: currentDate,
        },
        returnedFromService
      );

      service.create(new Deneme()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Deneme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
          olusturmaTarih: currentDate.format(DATE_FORMAT),
          baslamaTarih: currentDate.format(DATE_TIME_FORMAT),
          sure: 1,
          cevapAnahtar: 'BBBBBB',
          denemeInfoJson: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          olusturmaTarih: currentDate,
          baslamaTarih: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Deneme', () => {
      const patchObject = Object.assign(
        {
          baslamaTarih: currentDate.format(DATE_TIME_FORMAT),
        },
        new Deneme()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          olusturmaTarih: currentDate,
          baslamaTarih: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Deneme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
          olusturmaTarih: currentDate.format(DATE_FORMAT),
          baslamaTarih: currentDate.format(DATE_TIME_FORMAT),
          sure: 1,
          cevapAnahtar: 'BBBBBB',
          denemeInfoJson: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          olusturmaTarih: currentDate,
          baslamaTarih: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Deneme', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDenemeToCollectionIfMissing', () => {
      it('should add a Deneme to an empty array', () => {
        const deneme: IDeneme = { id: 123 };
        expectedResult = service.addDenemeToCollectionIfMissing([], deneme);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deneme);
      });

      it('should not add a Deneme to an array that contains it', () => {
        const deneme: IDeneme = { id: 123 };
        const denemeCollection: IDeneme[] = [
          {
            ...deneme,
          },
          { id: 456 },
        ];
        expectedResult = service.addDenemeToCollectionIfMissing(denemeCollection, deneme);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Deneme to an array that doesn't contain it", () => {
        const deneme: IDeneme = { id: 123 };
        const denemeCollection: IDeneme[] = [{ id: 456 }];
        expectedResult = service.addDenemeToCollectionIfMissing(denemeCollection, deneme);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deneme);
      });

      it('should add only unique Deneme to an array', () => {
        const denemeArray: IDeneme[] = [{ id: 123 }, { id: 456 }, { id: 67680 }];
        const denemeCollection: IDeneme[] = [{ id: 123 }];
        expectedResult = service.addDenemeToCollectionIfMissing(denemeCollection, ...denemeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const deneme: IDeneme = { id: 123 };
        const deneme2: IDeneme = { id: 456 };
        expectedResult = service.addDenemeToCollectionIfMissing([], deneme, deneme2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(deneme);
        expect(expectedResult).toContain(deneme2);
      });

      it('should accept null and undefined values', () => {
        const deneme: IDeneme = { id: 123 };
        expectedResult = service.addDenemeToCollectionIfMissing([], null, deneme, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(deneme);
      });

      it('should return initial array if no Deneme is added', () => {
        const denemeCollection: IDeneme[] = [{ id: 123 }];
        expectedResult = service.addDenemeToCollectionIfMissing(denemeCollection, undefined, null);
        expect(expectedResult).toEqual(denemeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
