import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISoru, Soru } from '../soru.model';

import { SoruService } from './soru.service';

describe('Soru Service', () => {
  let service: SoruService;
  let httpMock: HttpTestingController;
  let elemDefault: ISoru;
  let expectedResult: ISoru | ISoru[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SoruService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      isim: 'AAAAAAA',
      cevap: 'AAAAAAA',
      sira: 0,
      resimUrl: 'AAAAAAA',
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

    it('should create a Soru', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Soru()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Soru', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
          cevap: 'BBBBBB',
          sira: 1,
          resimUrl: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Soru', () => {
      const patchObject = Object.assign(
        {
          isim: 'BBBBBB',
          cevap: 'BBBBBB',
          sira: 1,
        },
        new Soru()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Soru', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isim: 'BBBBBB',
          cevap: 'BBBBBB',
          sira: 1,
          resimUrl: 'BBBBBB',
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

    it('should delete a Soru', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSoruToCollectionIfMissing', () => {
      it('should add a Soru to an empty array', () => {
        const soru: ISoru = { id: 123 };
        expectedResult = service.addSoruToCollectionIfMissing([], soru);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(soru);
      });

      it('should not add a Soru to an array that contains it', () => {
        const soru: ISoru = { id: 123 };
        const soruCollection: ISoru[] = [
          {
            ...soru,
          },
          { id: 456 },
        ];
        expectedResult = service.addSoruToCollectionIfMissing(soruCollection, soru);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Soru to an array that doesn't contain it", () => {
        const soru: ISoru = { id: 123 };
        const soruCollection: ISoru[] = [{ id: 456 }];
        expectedResult = service.addSoruToCollectionIfMissing(soruCollection, soru);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(soru);
      });

      it('should add only unique Soru to an array', () => {
        const soruArray: ISoru[] = [{ id: 123 }, { id: 456 }, { id: 14171 }];
        const soruCollection: ISoru[] = [{ id: 123 }];
        expectedResult = service.addSoruToCollectionIfMissing(soruCollection, ...soruArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const soru: ISoru = { id: 123 };
        const soru2: ISoru = { id: 456 };
        expectedResult = service.addSoruToCollectionIfMissing([], soru, soru2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(soru);
        expect(expectedResult).toContain(soru2);
      });

      it('should accept null and undefined values', () => {
        const soru: ISoru = { id: 123 };
        expectedResult = service.addSoruToCollectionIfMissing([], null, soru, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(soru);
      });

      it('should return initial array if no Soru is added', () => {
        const soruCollection: ISoru[] = [{ id: 123 }];
        expectedResult = service.addSoruToCollectionIfMissing(soruCollection, undefined, null);
        expect(expectedResult).toEqual(soruCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
