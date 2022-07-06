import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDenemeAnalizSinif, DenemeAnalizSinif } from '../deneme-analiz-sinif.model';

import { DenemeAnalizSinifService } from './deneme-analiz-sinif.service';

describe('DenemeAnalizSinif Service', () => {
  let service: DenemeAnalizSinifService;
  let httpMock: HttpTestingController;
  let elemDefault: IDenemeAnalizSinif;
  let expectedResult: IDenemeAnalizSinif | IDenemeAnalizSinif[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DenemeAnalizSinifService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      ortalama: 0,
      konuAnalizJson: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a DenemeAnalizSinif', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new DenemeAnalizSinif()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DenemeAnalizSinif', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ortalama: 1,
          konuAnalizJson: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DenemeAnalizSinif', () => {
      const patchObject = Object.assign(
        {
          ortalama: 1,
        },
        new DenemeAnalizSinif()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DenemeAnalizSinif', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ortalama: 1,
          konuAnalizJson: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a DenemeAnalizSinif', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDenemeAnalizSinifToCollectionIfMissing', () => {
      it('should add a DenemeAnalizSinif to an empty array', () => {
        const denemeAnalizSinif: IDenemeAnalizSinif = { id: 123 };
        expectedResult = service.addDenemeAnalizSinifToCollectionIfMissing([], denemeAnalizSinif);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(denemeAnalizSinif);
      });

      it('should not add a DenemeAnalizSinif to an array that contains it', () => {
        const denemeAnalizSinif: IDenemeAnalizSinif = { id: 123 };
        const denemeAnalizSinifCollection: IDenemeAnalizSinif[] = [
          {
            ...denemeAnalizSinif,
          },
          { id: 456 },
        ];
        expectedResult = service.addDenemeAnalizSinifToCollectionIfMissing(denemeAnalizSinifCollection, denemeAnalizSinif);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DenemeAnalizSinif to an array that doesn't contain it", () => {
        const denemeAnalizSinif: IDenemeAnalizSinif = { id: 123 };
        const denemeAnalizSinifCollection: IDenemeAnalizSinif[] = [{ id: 456 }];
        expectedResult = service.addDenemeAnalizSinifToCollectionIfMissing(denemeAnalizSinifCollection, denemeAnalizSinif);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(denemeAnalizSinif);
      });

      it('should add only unique DenemeAnalizSinif to an array', () => {
        const denemeAnalizSinifArray: IDenemeAnalizSinif[] = [{ id: 123 }, { id: 456 }, { id: 21693 }];
        const denemeAnalizSinifCollection: IDenemeAnalizSinif[] = [{ id: 123 }];
        expectedResult = service.addDenemeAnalizSinifToCollectionIfMissing(denemeAnalizSinifCollection, ...denemeAnalizSinifArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const denemeAnalizSinif: IDenemeAnalizSinif = { id: 123 };
        const denemeAnalizSinif2: IDenemeAnalizSinif = { id: 456 };
        expectedResult = service.addDenemeAnalizSinifToCollectionIfMissing([], denemeAnalizSinif, denemeAnalizSinif2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(denemeAnalizSinif);
        expect(expectedResult).toContain(denemeAnalizSinif2);
      });

      it('should accept null and undefined values', () => {
        const denemeAnalizSinif: IDenemeAnalizSinif = { id: 123 };
        expectedResult = service.addDenemeAnalizSinifToCollectionIfMissing([], null, denemeAnalizSinif, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(denemeAnalizSinif);
      });

      it('should return initial array if no DenemeAnalizSinif is added', () => {
        const denemeAnalizSinifCollection: IDenemeAnalizSinif[] = [{ id: 123 }];
        expectedResult = service.addDenemeAnalizSinifToCollectionIfMissing(denemeAnalizSinifCollection, undefined, null);
        expect(expectedResult).toEqual(denemeAnalizSinifCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
