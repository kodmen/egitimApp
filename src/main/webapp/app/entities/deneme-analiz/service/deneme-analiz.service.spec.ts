import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDenemeAnaliz, DenemeAnaliz } from '../deneme-analiz.model';

import { DenemeAnalizService } from './deneme-analiz.service';

describe('DenemeAnaliz Service', () => {
  let service: DenemeAnalizService;
  let httpMock: HttpTestingController;
  let elemDefault: IDenemeAnaliz;
  let expectedResult: IDenemeAnaliz | IDenemeAnaliz[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DenemeAnalizService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      dogru: 0,
      yanlis: 0,
      puan: 0,
      cozuldu: false,
      konuAnalizJson: 'AAAAAAA',
      sure: 0,
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

    it('should create a DenemeAnaliz', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new DenemeAnaliz()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DenemeAnaliz', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dogru: 1,
          yanlis: 1,
          puan: 1,
          cozuldu: true,
          konuAnalizJson: 'BBBBBB',
          sure: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DenemeAnaliz', () => {
      const patchObject = Object.assign(
        {
          cozuldu: true,
          sure: 1,
        },
        new DenemeAnaliz()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DenemeAnaliz', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dogru: 1,
          yanlis: 1,
          puan: 1,
          cozuldu: true,
          konuAnalizJson: 'BBBBBB',
          sure: 1,
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

    it('should delete a DenemeAnaliz', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDenemeAnalizToCollectionIfMissing', () => {
      it('should add a DenemeAnaliz to an empty array', () => {
        const denemeAnaliz: IDenemeAnaliz = { id: 123 };
        expectedResult = service.addDenemeAnalizToCollectionIfMissing([], denemeAnaliz);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(denemeAnaliz);
      });

      it('should not add a DenemeAnaliz to an array that contains it', () => {
        const denemeAnaliz: IDenemeAnaliz = { id: 123 };
        const denemeAnalizCollection: IDenemeAnaliz[] = [
          {
            ...denemeAnaliz,
          },
          { id: 456 },
        ];
        expectedResult = service.addDenemeAnalizToCollectionIfMissing(denemeAnalizCollection, denemeAnaliz);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DenemeAnaliz to an array that doesn't contain it", () => {
        const denemeAnaliz: IDenemeAnaliz = { id: 123 };
        const denemeAnalizCollection: IDenemeAnaliz[] = [{ id: 456 }];
        expectedResult = service.addDenemeAnalizToCollectionIfMissing(denemeAnalizCollection, denemeAnaliz);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(denemeAnaliz);
      });

      it('should add only unique DenemeAnaliz to an array', () => {
        const denemeAnalizArray: IDenemeAnaliz[] = [{ id: 123 }, { id: 456 }, { id: 48689 }];
        const denemeAnalizCollection: IDenemeAnaliz[] = [{ id: 123 }];
        expectedResult = service.addDenemeAnalizToCollectionIfMissing(denemeAnalizCollection, ...denemeAnalizArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const denemeAnaliz: IDenemeAnaliz = { id: 123 };
        const denemeAnaliz2: IDenemeAnaliz = { id: 456 };
        expectedResult = service.addDenemeAnalizToCollectionIfMissing([], denemeAnaliz, denemeAnaliz2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(denemeAnaliz);
        expect(expectedResult).toContain(denemeAnaliz2);
      });

      it('should accept null and undefined values', () => {
        const denemeAnaliz: IDenemeAnaliz = { id: 123 };
        expectedResult = service.addDenemeAnalizToCollectionIfMissing([], null, denemeAnaliz, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(denemeAnaliz);
      });

      it('should return initial array if no DenemeAnaliz is added', () => {
        const denemeAnalizCollection: IDenemeAnaliz[] = [{ id: 123 }];
        expectedResult = service.addDenemeAnalizToCollectionIfMissing(denemeAnalizCollection, undefined, null);
        expect(expectedResult).toEqual(denemeAnalizCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
