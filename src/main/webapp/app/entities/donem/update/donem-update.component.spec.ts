import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DonemService } from '../service/donem.service';
import { IDonem, Donem } from '../donem.model';

import { DonemUpdateComponent } from './donem-update.component';

describe('Donem Management Update Component', () => {
  let comp: DonemUpdateComponent;
  let fixture: ComponentFixture<DonemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let donemService: DonemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DonemUpdateComponent],
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
      .overrideTemplate(DonemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    donemService = TestBed.inject(DonemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const donem: IDonem = { id: 456 };

      activatedRoute.data = of({ donem });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(donem));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donem>>();
      const donem = { id: 123 };
      jest.spyOn(donemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donem }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(donemService.update).toHaveBeenCalledWith(donem);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donem>>();
      const donem = new Donem();
      jest.spyOn(donemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donem }));
      saveSubject.complete();

      // THEN
      expect(donemService.create).toHaveBeenCalledWith(donem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Donem>>();
      const donem = { id: 123 };
      jest.spyOn(donemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(donemService.update).toHaveBeenCalledWith(donem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
