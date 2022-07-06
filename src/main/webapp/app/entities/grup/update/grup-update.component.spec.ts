import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrupService } from '../service/grup.service';
import { IGrup, Grup } from '../grup.model';

import { GrupUpdateComponent } from './grup-update.component';

describe('Grup Management Update Component', () => {
  let comp: GrupUpdateComponent;
  let fixture: ComponentFixture<GrupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grupService: GrupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrupUpdateComponent],
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
      .overrideTemplate(GrupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grupService = TestBed.inject(GrupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grup: IGrup = { id: 456 };

      activatedRoute.data = of({ grup });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grup));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grup>>();
      const grup = { id: 123 };
      jest.spyOn(grupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grup }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grupService.update).toHaveBeenCalledWith(grup);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grup>>();
      const grup = new Grup();
      jest.spyOn(grupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grup }));
      saveSubject.complete();

      // THEN
      expect(grupService.create).toHaveBeenCalledWith(grup);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grup>>();
      const grup = { id: 123 };
      jest.spyOn(grupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grupService.update).toHaveBeenCalledWith(grup);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
