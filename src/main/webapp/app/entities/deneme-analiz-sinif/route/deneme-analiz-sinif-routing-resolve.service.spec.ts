import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDenemeAnalizSinif, DenemeAnalizSinif } from '../deneme-analiz-sinif.model';
import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';

import { DenemeAnalizSinifRoutingResolveService } from './deneme-analiz-sinif-routing-resolve.service';

describe('DenemeAnalizSinif routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DenemeAnalizSinifRoutingResolveService;
  let service: DenemeAnalizSinifService;
  let resultDenemeAnalizSinif: IDenemeAnalizSinif | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(DenemeAnalizSinifRoutingResolveService);
    service = TestBed.inject(DenemeAnalizSinifService);
    resultDenemeAnalizSinif = undefined;
  });

  describe('resolve', () => {
    it('should return IDenemeAnalizSinif returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDenemeAnalizSinif = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDenemeAnalizSinif).toEqual({ id: 123 });
    });

    it('should return new IDenemeAnalizSinif if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDenemeAnalizSinif = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDenemeAnalizSinif).toEqual(new DenemeAnalizSinif());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DenemeAnalizSinif })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDenemeAnalizSinif = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDenemeAnalizSinif).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
