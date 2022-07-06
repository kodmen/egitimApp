import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IYurt, Yurt } from '../yurt.model';

import { YurtService } from './yurt.service';

describe('Yurt Service', () => {
  let service: YurtService;
  let httpMock: HttpTestingController;
  let elemDefault: IYurt;
  let expectedResult: IYurt | IYurt[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(YurtService);
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

    it('should create a Yurt', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Yurt()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Yurt', () => {
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

    it('should partial update a Yurt', () => {
      const patchObject = Object.assign(
        {
          isim: 'BBBBBB',
        },
        new Yurt()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Yurt', () => {
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

    it('should delete a Yurt', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addYurtToCollectionIfMissing', () => {
      it('should add a Yurt to an empty array', () => {
        const yurt: IYurt = { id: 123 };
        expectedResult = service.addYurtToCollectionIfMissing([], yurt);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(yurt);
      });

      it('should not add a Yurt to an array that contains it', () => {
        const yurt: IYurt = { id: 123 };
        const yurtCollection: IYurt[] = [
          {
            ...yurt,
          },
          { id: 456 },
        ];
        expectedResult = service.addYurtToCollectionIfMissing(yurtCollection, yurt);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Yurt to an array that doesn't contain it", () => {
        const yurt: IYurt = { id: 123 };
        const yurtCollection: IYurt[] = [{ id: 456 }];
        expectedResult = service.addYurtToCollectionIfMissing(yurtCollection, yurt);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(yurt);
      });

      it('should add only unique Yurt to an array', () => {
        const yurtArray: IYurt[] = [{ id: 123 }, { id: 456 }, { id: 43556 }];
        const yurtCollection: IYurt[] = [{ id: 123 }];
        expectedResult = service.addYurtToCollectionIfMissing(yurtCollection, ...yurtArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const yurt: IYurt = { id: 123 };
        const yurt2: IYurt = { id: 456 };
        expectedResult = service.addYurtToCollectionIfMissing([], yurt, yurt2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(yurt);
        expect(expectedResult).toContain(yurt2);
      });

      it('should accept null and undefined values', () => {
        const yurt: IYurt = { id: 123 };
        expectedResult = service.addYurtToCollectionIfMissing([], null, yurt, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(yurt);
      });

      it('should return initial array if no Yurt is added', () => {
        const yurtCollection: IYurt[] = [{ id: 123 }];
        expectedResult = service.addYurtToCollectionIfMissing(yurtCollection, undefined, null);
        expect(expectedResult).toEqual(yurtCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
