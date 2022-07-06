import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKonu, Konu } from '../konu.model';

import { KonuService } from './konu.service';

describe('Konu Service', () => {
  let service: KonuService;
  let httpMock: HttpTestingController;
  let elemDefault: IKonu;
  let expectedResult: IKonu | IKonu[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KonuService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      isim: 'AAAAAAA',
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

    it('should create a Konu', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Konu()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Konu', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Konu', () => {
      const patchObject = Object.assign(
        {
          isim: 'BBBBBB',
        },
        new Konu()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Konu', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
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

    it('should delete a Konu', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addKonuToCollectionIfMissing', () => {
      it('should add a Konu to an empty array', () => {
        const konu: IKonu = { id: 123 };
        expectedResult = service.addKonuToCollectionIfMissing([], konu);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(konu);
      });

      it('should not add a Konu to an array that contains it', () => {
        const konu: IKonu = { id: 123 };
        const konuCollection: IKonu[] = [
          {
            ...konu,
          },
          { id: 456 },
        ];
        expectedResult = service.addKonuToCollectionIfMissing(konuCollection, konu);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Konu to an array that doesn't contain it", () => {
        const konu: IKonu = { id: 123 };
        const konuCollection: IKonu[] = [{ id: 456 }];
        expectedResult = service.addKonuToCollectionIfMissing(konuCollection, konu);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(konu);
      });

      it('should add only unique Konu to an array', () => {
        const konuArray: IKonu[] = [{ id: 123 }, { id: 456 }, { id: 7022 }];
        const konuCollection: IKonu[] = [{ id: 123 }];
        expectedResult = service.addKonuToCollectionIfMissing(konuCollection, ...konuArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const konu: IKonu = { id: 123 };
        const konu2: IKonu = { id: 456 };
        expectedResult = service.addKonuToCollectionIfMissing([], konu, konu2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(konu);
        expect(expectedResult).toContain(konu2);
      });

      it('should accept null and undefined values', () => {
        const konu: IKonu = { id: 123 };
        expectedResult = service.addKonuToCollectionIfMissing([], null, konu, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(konu);
      });

      it('should return initial array if no Konu is added', () => {
        const konuCollection: IKonu[] = [{ id: 123 }];
        expectedResult = service.addKonuToCollectionIfMissing(konuCollection, undefined, null);
        expect(expectedResult).toEqual(konuCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
