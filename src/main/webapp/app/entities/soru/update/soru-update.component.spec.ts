import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SoruService } from '../service/soru.service';
import { ISoru, Soru } from '../soru.model';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';

import { SoruUpdateComponent } from './soru-update.component';

describe('Soru Management Update Component', () => {
  let comp: SoruUpdateComponent;
  let fixture: ComponentFixture<SoruUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let soruService: SoruService;
  let konuService: KonuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SoruUpdateComponent],
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
      .overrideTemplate(SoruUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SoruUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    soruService = TestBed.inject(SoruService);
    konuService = TestBed.inject(KonuService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Konu query and add missing value', () => {
      const soru: ISoru = { id: 456 };
      const konu: IKonu = { id: 33490 };
      soru.konu = konu;

      const konuCollection: IKonu[] = [{ id: 33949 }];
      jest.spyOn(konuService, 'query').mockReturnValue(of(new HttpResponse({ body: konuCollection })));
      const additionalKonus = [konu];
      const expectedCollection: IKonu[] = [...additionalKonus, ...konuCollection];
      jest.spyOn(konuService, 'addKonuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ soru });
      comp.ngOnInit();

      expect(konuService.query).toHaveBeenCalled();
      expect(konuService.addKonuToCollectionIfMissing).toHaveBeenCalledWith(konuCollection, ...additionalKonus);
      expect(comp.konusSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const soru: ISoru = { id: 456 };
      const konu: IKonu = { id: 86290 };
      soru.konu = konu;

      activatedRoute.data = of({ soru });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(soru));
      expect(comp.konusSharedCollection).toContain(konu);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Soru>>();
      const soru = { id: 123 };
      jest.spyOn(soruService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soru });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soru }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(soruService.update).toHaveBeenCalledWith(soru);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Soru>>();
      const soru = new Soru();
      jest.spyOn(soruService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soru });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: soru }));
      saveSubject.complete();

      // THEN
      expect(soruService.create).toHaveBeenCalledWith(soru);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Soru>>();
      const soru = { id: 123 };
      jest.spyOn(soruService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ soru });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(soruService.update).toHaveBeenCalledWith(soru);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackKonuById', () => {
      it('Should return tracked Konu primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackKonuById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
