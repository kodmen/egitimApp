import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DenemeService } from '../service/deneme.service';
import { IDeneme, Deneme } from '../deneme.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISoru } from 'app/entities/soru/soru.model';
import { SoruService } from 'app/entities/soru/service/soru.service';

import { DenemeUpdateComponent } from './deneme-update.component';

describe('Deneme Management Update Component', () => {
  let comp: DenemeUpdateComponent;
  let fixture: ComponentFixture<DenemeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let denemeService: DenemeService;
  let userService: UserService;
  let soruService: SoruService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DenemeUpdateComponent],
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
      .overrideTemplate(DenemeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DenemeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    denemeService = TestBed.inject(DenemeService);
    userService = TestBed.inject(UserService);
    soruService = TestBed.inject(SoruService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const deneme: IDeneme = { id: 456 };
      const olusturan: IUser = { id: 96863 };
      deneme.olusturan = olusturan;

      const userCollection: IUser[] = [{ id: 60324 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [olusturan];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ deneme });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Soru query and add missing value', () => {
      const deneme: IDeneme = { id: 456 };
      const sorulars: ISoru[] = [{ id: 36485 }];
      deneme.sorulars = sorulars;

      const soruCollection: ISoru[] = [{ id: 84679 }];
      jest.spyOn(soruService, 'query').mockReturnValue(of(new HttpResponse({ body: soruCollection })));
      const additionalSorus = [...sorulars];
      const expectedCollection: ISoru[] = [...additionalSorus, ...soruCollection];
      jest.spyOn(soruService, 'addSoruToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ deneme });
      comp.ngOnInit();

      expect(soruService.query).toHaveBeenCalled();
      expect(soruService.addSoruToCollectionIfMissing).toHaveBeenCalledWith(soruCollection, ...additionalSorus);
      expect(comp.sorusSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const deneme: IDeneme = { id: 456 };
      const olusturan: IUser = { id: 67190 };
      deneme.olusturan = olusturan;
      const sorulars: ISoru = { id: 37552 };
      deneme.sorulars = [sorulars];

      activatedRoute.data = of({ deneme });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(deneme));
      expect(comp.usersSharedCollection).toContain(olusturan);
      expect(comp.sorusSharedCollection).toContain(sorulars);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Deneme>>();
      const deneme = { id: 123 };
      jest.spyOn(denemeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deneme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: deneme }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(denemeService.update).toHaveBeenCalledWith(deneme);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Deneme>>();
      const deneme = new Deneme();
      jest.spyOn(denemeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deneme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: deneme }));
      saveSubject.complete();

      // THEN
      expect(denemeService.create).toHaveBeenCalledWith(deneme);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Deneme>>();
      const deneme = { id: 123 };
      jest.spyOn(denemeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deneme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(denemeService.update).toHaveBeenCalledWith(deneme);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSoruById', () => {
      it('Should return tracked Soru primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSoruById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedSoru', () => {
      it('Should return option if no Soru is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedSoru(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Soru for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedSoru(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Soru is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedSoru(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
