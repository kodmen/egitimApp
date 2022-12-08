import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MesajService } from '../service/mesaj.service';
import { IMesaj, Mesaj } from '../mesaj.model';

import { MesajUpdateComponent } from './mesaj-update.component';

describe('Mesaj Management Update Component', () => {
  let comp: MesajUpdateComponent;
  let fixture: ComponentFixture<MesajUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mesajService: MesajService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MesajUpdateComponent],
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
      .overrideTemplate(MesajUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MesajUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mesajService = TestBed.inject(MesajService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mesaj: IMesaj = { id: 456 };

      activatedRoute.data = of({ mesaj });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(mesaj));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mesaj>>();
      const mesaj = { id: 123 };
      jest.spyOn(mesajService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesaj });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mesaj }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(mesajService.update).toHaveBeenCalledWith(mesaj);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mesaj>>();
      const mesaj = new Mesaj();
      jest.spyOn(mesajService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesaj });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mesaj }));
      saveSubject.complete();

      // THEN
      expect(mesajService.create).toHaveBeenCalledWith(mesaj);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mesaj>>();
      const mesaj = { id: 123 };
      jest.spyOn(mesajService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesaj });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mesajService.update).toHaveBeenCalledWith(mesaj);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
