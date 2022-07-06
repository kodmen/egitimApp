import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KonuService } from '../service/konu.service';
import { IKonu, Konu } from '../konu.model';

import { KonuUpdateComponent } from './konu-update.component';

describe('Konu Management Update Component', () => {
  let comp: KonuUpdateComponent;
  let fixture: ComponentFixture<KonuUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let konuService: KonuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KonuUpdateComponent],
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
      .overrideTemplate(KonuUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KonuUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    konuService = TestBed.inject(KonuService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const konu: IKonu = { id: 456 };

      activatedRoute.data = of({ konu });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(konu));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Konu>>();
      const konu = { id: 123 };
      jest.spyOn(konuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ konu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: konu }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(konuService.update).toHaveBeenCalledWith(konu);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Konu>>();
      const konu = new Konu();
      jest.spyOn(konuService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ konu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: konu }));
      saveSubject.complete();

      // THEN
      expect(konuService.create).toHaveBeenCalledWith(konu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Konu>>();
      const konu = { id: 123 };
      jest.spyOn(konuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ konu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(konuService.update).toHaveBeenCalledWith(konu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
