import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISinif, Sinif } from '../sinif.model';

import { SinifService } from './sinif.service';

describe('Sinif Service', () => {
  let service: SinifService;
  let httpMock: HttpTestingController;
  let elemDefault: ISinif;
  let expectedResult: ISinif | ISinif[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SinifService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      isim: 'AAAAAAA',
      konulimizjson: 'AAAAAAA',
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

    it('should create a Sinif', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Sinif()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sinif', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
          konulimizjson: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Sinif', () => {
      const patchObject = Object.assign(
        {
          isim: 'BBBBBB',
          konulimizjson: 'BBBBBB',
        },
        new Sinif()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sinif', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
          konulimizjson: 'BBBBBB',
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

    it('should delete a Sinif', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSinifToCollectionIfMissing', () => {
      it('should add a Sinif to an empty array', () => {
        const sinif: ISinif = { id: 123 };
        expectedResult = service.addSinifToCollectionIfMissing([], sinif);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sinif);
      });

      it('should not add a Sinif to an array that contains it', () => {
        const sinif: ISinif = { id: 123 };
        const sinifCollection: ISinif[] = [
          {
            ...sinif,
          },
          { id: 456 },
        ];
        expectedResult = service.addSinifToCollectionIfMissing(sinifCollection, sinif);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sinif to an array that doesn't contain it", () => {
        const sinif: ISinif = { id: 123 };
        const sinifCollection: ISinif[] = [{ id: 456 }];
        expectedResult = service.addSinifToCollectionIfMissing(sinifCollection, sinif);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sinif);
      });

      it('should add only unique Sinif to an array', () => {
        const sinifArray: ISinif[] = [{ id: 123 }, { id: 456 }, { id: 32157 }];
        const sinifCollection: ISinif[] = [{ id: 123 }];
        expectedResult = service.addSinifToCollectionIfMissing(sinifCollection, ...sinifArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sinif: ISinif = { id: 123 };
        const sinif2: ISinif = { id: 456 };
        expectedResult = service.addSinifToCollectionIfMissing([], sinif, sinif2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sinif);
        expect(expectedResult).toContain(sinif2);
      });

      it('should accept null and undefined values', () => {
        const sinif: ISinif = { id: 123 };
        expectedResult = service.addSinifToCollectionIfMissing([], null, sinif, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sinif);
      });

      it('should return initial array if no Sinif is added', () => {
        const sinifCollection: ISinif[] = [{ id: 123 }];
        expectedResult = service.addSinifToCollectionIfMissing(sinifCollection, undefined, null);
        expect(expectedResult).toEqual(sinifCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
