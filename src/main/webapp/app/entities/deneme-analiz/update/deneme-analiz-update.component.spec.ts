import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DenemeAnalizService } from '../service/deneme-analiz.service';
import { IDenemeAnaliz, DenemeAnaliz } from '../deneme-analiz.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDeneme } from 'app/entities/deneme/deneme.model';
import { DenemeService } from 'app/entities/deneme/service/deneme.service';

import { DenemeAnalizUpdateComponent } from './deneme-analiz-update.component';

describe('DenemeAnaliz Management Update Component', () => {
  let comp: DenemeAnalizUpdateComponent;
  let fixture: ComponentFixture<DenemeAnalizUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let denemeAnalizService: DenemeAnalizService;
  let userService: UserService;
  let denemeService: DenemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DenemeAnalizUpdateComponent],
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
      .overrideTemplate(DenemeAnalizUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DenemeAnalizUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    denemeAnalizService = TestBed.inject(DenemeAnalizService);
    userService = TestBed.inject(UserService);
    denemeService = TestBed.inject(DenemeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const denemeAnaliz: IDenemeAnaliz = { id: 456 };
      const user: IUser = { id: 69131 };
      denemeAnaliz.user = user;

      const userCollection: IUser[] = [{ id: 67730 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ denemeAnaliz });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Deneme query and add missing value', () => {
      const denemeAnaliz: IDenemeAnaliz = { id: 456 };
      const deneme: IDeneme = { id: 1672 };
      denemeAnaliz.deneme = deneme;

      const denemeCollection: IDeneme[] = [{ id: 92456 }];
      jest.spyOn(denemeService, 'query').mockReturnValue(of(new HttpResponse({ body: denemeCollection })));
      const additionalDenemes = [deneme];
      const expectedCollection: IDeneme[] = [...additionalDenemes, ...denemeCollection];
      jest.spyOn(denemeService, 'addDenemeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ denemeAnaliz });
      comp.ngOnInit();

      expect(denemeService.query).toHaveBeenCalled();
      expect(denemeService.addDenemeToCollectionIfMissing).toHaveBeenCalledWith(denemeCollection, ...additionalDenemes);
      expect(comp.denemesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const denemeAnaliz: IDenemeAnaliz = { id: 456 };
      const user: IUser = { id: 68648 };
      denemeAnaliz.user = user;
      const deneme: IDeneme = { id: 61268 };
      denemeAnaliz.deneme = deneme;

      activatedRoute.data = of({ denemeAnaliz });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(denemeAnaliz));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.denemesSharedCollection).toContain(deneme);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DenemeAnaliz>>();
      const denemeAnaliz = { id: 123 };
      jest.spyOn(denemeAnalizService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ denemeAnaliz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: denemeAnaliz }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(denemeAnalizService.update).toHaveBeenCalledWith(denemeAnaliz);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DenemeAnaliz>>();
      const denemeAnaliz = new DenemeAnaliz();
      jest.spyOn(denemeAnalizService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ denemeAnaliz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: denemeAnaliz }));
      saveSubject.complete();

      // THEN
      expect(denemeAnalizService.create).toHaveBeenCalledWith(denemeAnaliz);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DenemeAnaliz>>();
      const denemeAnaliz = { id: 123 };
      jest.spyOn(denemeAnalizService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ denemeAnaliz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(denemeAnalizService.update).toHaveBeenCalledWith(denemeAnaliz);
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

    describe('trackDenemeById', () => {
      it('Should return tracked Deneme primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDenemeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
