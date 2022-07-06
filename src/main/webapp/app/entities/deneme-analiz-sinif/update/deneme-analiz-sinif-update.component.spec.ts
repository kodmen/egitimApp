import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';
import { IDenemeAnalizSinif, DenemeAnalizSinif } from '../deneme-analiz-sinif.model';
import { IDeneme } from 'app/entities/deneme/deneme.model';
import { DenemeService } from 'app/entities/deneme/service/deneme.service';
import { ISinif } from 'app/entities/sinif/sinif.model';
import { SinifService } from 'app/entities/sinif/service/sinif.service';

import { DenemeAnalizSinifUpdateComponent } from './deneme-analiz-sinif-update.component';

describe('DenemeAnalizSinif Management Update Component', () => {
  let comp: DenemeAnalizSinifUpdateComponent;
  let fixture: ComponentFixture<DenemeAnalizSinifUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let denemeAnalizSinifService: DenemeAnalizSinifService;
  let denemeService: DenemeService;
  let sinifService: SinifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DenemeAnalizSinifUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DenemeAnalizSinifUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DenemeAnalizSinifUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    denemeAnalizSinifService = TestBed.inject(DenemeAnalizSinifService);
    denemeService = TestBed.inject(DenemeService);
    sinifService = TestBed.inject(SinifService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Deneme query and add missing value', () => {
      const denemeAnalizSinif: IDenemeAnalizSinif = { id: 456 };
      const deneme: IDeneme = { id: 66458 };
      denemeAnalizSinif.deneme = deneme;

      const denemeCollection: IDeneme[] = [{ id: 52546 }];
      jest.spyOn(denemeService, 'query').mockReturnValue(of(new HttpResponse({ body: denemeCollection })));
      const additionalDenemes = [deneme];
      const expectedCollection: IDeneme[] = [...additionalDenemes, ...denemeCollection];
      jest.spyOn(denemeService, 'addDenemeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ denemeAnalizSinif });
      comp.ngOnInit();

      expect(denemeService.query).toHaveBeenCalled();
      expect(denemeService.addDenemeToCollectionIfMissing).toHaveBeenCalledWith(denemeCollection, ...additionalDenemes);
      expect(comp.denemesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sinif query and add missing value', () => {
      const denemeAnalizSinif: IDenemeAnalizSinif = { id: 456 };
      const sinif: ISinif = { id: 50264 };
      denemeAnalizSinif.sinif = sinif;

      const sinifCollection: ISinif[] = [{ id: 92435 }];
      jest.spyOn(sinifService, 'query').mockReturnValue(of(new HttpResponse({ body: sinifCollection })));
      const additionalSinifs = [sinif];
      const expectedCollection: ISinif[] = [...additionalSinifs, ...sinifCollection];
      jest.spyOn(sinifService, 'addSinifToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ denemeAnalizSinif });
      comp.ngOnInit();

      expect(sinifService.query).toHaveBeenCalled();
      expect(sinifService.addSinifToCollectionIfMissing).toHaveBeenCalledWith(sinifCollection, ...additionalSinifs);
      expect(comp.sinifsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const denemeAnalizSinif: IDenemeAnalizSinif = { id: 456 };
      const deneme: IDeneme = { id: 62809 };
      denemeAnalizSinif.deneme = deneme;
      const sinif: ISinif = { id: 20235 };
      denemeAnalizSinif.sinif = sinif;

      activatedRoute.data = of({ denemeAnalizSinif });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(denemeAnalizSinif));
      expect(comp.denemesSharedCollection).toContain(deneme);
      expect(comp.sinifsSharedCollection).toContain(sinif);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DenemeAnalizSinif>>();
      const denemeAnalizSinif = { id: 123 };
      jest.spyOn(denemeAnalizSinifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ denemeAnalizSinif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: denemeAnalizSinif }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(denemeAnalizSinifService.update).toHaveBeenCalledWith(denemeAnalizSinif);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DenemeAnalizSinif>>();
      const denemeAnalizSinif = new DenemeAnalizSinif();
      jest.spyOn(denemeAnalizSinifService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ denemeAnalizSinif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: denemeAnalizSinif }));
      saveSubject.complete();

      // THEN
      expect(denemeAnalizSinifService.create).toHaveBeenCalledWith(denemeAnalizSinif);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DenemeAnalizSinif>>();
      const denemeAnalizSinif = { id: 123 };
      jest.spyOn(denemeAnalizSinifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ denemeAnalizSinif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(denemeAnalizSinifService.update).toHaveBeenCalledWith(denemeAnalizSinif);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDenemeById', () => {
      it('Should return tracked Deneme primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDenemeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSinifById', () => {
      it('Should return tracked Sinif primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSinifById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
