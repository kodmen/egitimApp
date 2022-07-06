import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrup, Grup } from '../grup.model';

import { GrupService } from './grup.service';

describe('Grup Service', () => {
  let service: GrupService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrup;
  let expectedResult: IGrup | IGrup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrupService);
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

    it('should create a Grup', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Grup()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Grup', () => {
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

    it('should partial update a Grup', () => {
      const patchObject = Object.assign({}, new Grup());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Grup', () => {
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

    it('should delete a Grup', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrupToCollectionIfMissing', () => {
      it('should add a Grup to an empty array', () => {
        const grup: IGrup = { id: 123 };
        expectedResult = service.addGrupToCollectionIfMissing([], grup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grup);
      });

      it('should not add a Grup to an array that contains it', () => {
        const grup: IGrup = { id: 123 };
        const grupCollection: IGrup[] = [
          {
            ...grup,
          },
          { id: 456 },
        ];
        expectedResult = service.addGrupToCollectionIfMissing(grupCollection, grup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Grup to an array that doesn't contain it", () => {
        const grup: IGrup = { id: 123 };
        const grupCollection: IGrup[] = [{ id: 456 }];
        expectedResult = service.addGrupToCollectionIfMissing(grupCollection, grup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grup);
      });

      it('should add only unique Grup to an array', () => {
        const grupArray: IGrup[] = [{ id: 123 }, { id: 456 }, { id: 58341 }];
        const grupCollection: IGrup[] = [{ id: 123 }];
        expectedResult = service.addGrupToCollectionIfMissing(grupCollection, ...grupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grup: IGrup = { id: 123 };
        const grup2: IGrup = { id: 456 };
        expectedResult = service.addGrupToCollectionIfMissing([], grup, grup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grup);
        expect(expectedResult).toContain(grup2);
      });

      it('should accept null and undefined values', () => {
        const grup: IGrup = { id: 123 };
        expectedResult = service.addGrupToCollectionIfMissing([], null, grup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grup);
      });

      it('should return initial array if no Grup is added', () => {
        const grupCollection: IGrup[] = [{ id: 123 }];
        expectedResult = service.addGrupToCollectionIfMissing(grupCollection, undefined, null);
        expect(expectedResult).toEqual(grupCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
