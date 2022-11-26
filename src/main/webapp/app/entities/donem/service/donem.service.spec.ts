import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDonem, Donem } from '../donem.model';

import { DonemService } from './donem.service';

describe('Donem Service', () => {
  let service: DonemService;
  let httpMock: HttpTestingController;
  let elemDefault: IDonem;
  let expectedResult: IDonem | IDonem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DonemService);
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

    it('should create a Donem', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Donem()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Donem', () => {
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

    it('should partial update a Donem', () => {
      const patchObject = Object.assign(
        {
          isim: 'BBBBBB',
        },
        new Donem()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Donem', () => {
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

    it('should delete a Donem', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDonemToCollectionIfMissing', () => {
      it('should add a Donem to an empty array', () => {
        const donem: IDonem = { id: 123 };
        expectedResult = service.addDonemToCollectionIfMissing([], donem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donem);
      });

      it('should not add a Donem to an array that contains it', () => {
        const donem: IDonem = { id: 123 };
        const donemCollection: IDonem[] = [
          {
            ...donem,
          },
          { id: 456 },
        ];
        expectedResult = service.addDonemToCollectionIfMissing(donemCollection, donem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Donem to an array that doesn't contain it", () => {
        const donem: IDonem = { id: 123 };
        const donemCollection: IDonem[] = [{ id: 456 }];
        expectedResult = service.addDonemToCollectionIfMissing(donemCollection, donem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donem);
      });

      it('should add only unique Donem to an array', () => {
        const donemArray: IDonem[] = [{ id: 123 }, { id: 456 }, { id: 85305 }];
        const donemCollection: IDonem[] = [{ id: 123 }];
        expectedResult = service.addDonemToCollectionIfMissing(donemCollection, ...donemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const donem: IDonem = { id: 123 };
        const donem2: IDonem = { id: 456 };
        expectedResult = service.addDonemToCollectionIfMissing([], donem, donem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donem);
        expect(expectedResult).toContain(donem2);
      });

      it('should accept null and undefined values', () => {
        const donem: IDonem = { id: 123 };
        expectedResult = service.addDonemToCollectionIfMissing([], null, donem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donem);
      });

      it('should return initial array if no Donem is added', () => {
        const donemCollection: IDonem[] = [{ id: 123 }];
        expectedResult = service.addDonemToCollectionIfMissing(donemCollection, undefined, null);
        expect(expectedResult).toEqual(donemCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
