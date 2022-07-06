import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SinifService } from '../service/sinif.service';
import { ISinif, Sinif } from '../sinif.model';
import { IYurt } from 'app/entities/yurt/yurt.model';
import { YurtService } from 'app/entities/yurt/service/yurt.service';
import { IGrup } from 'app/entities/grup/grup.model';
import { GrupService } from 'app/entities/grup/service/grup.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { SinifUpdateComponent } from './sinif-update.component';

describe('Sinif Management Update Component', () => {
  let comp: SinifUpdateComponent;
  let fixture: ComponentFixture<SinifUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sinifService: SinifService;
  let yurtService: YurtService;
  let grupService: GrupService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SinifUpdateComponent],
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
      .overrideTemplate(SinifUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SinifUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sinifService = TestBed.inject(SinifService);
    yurtService = TestBed.inject(YurtService);
    grupService = TestBed.inject(GrupService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Yurt query and add missing value', () => {
      const sinif: ISinif = { id: 456 };
      const yurt: IYurt = { id: 58064 };
      sinif.yurt = yurt;

      const yurtCollection: IYurt[] = [{ id: 86214 }];
      jest.spyOn(yurtService, 'query').mockReturnValue(of(new HttpResponse({ body: yurtCollection })));
      const additionalYurts = [yurt];
      const expectedCollection: IYurt[] = [...additionalYurts, ...yurtCollection];
      jest.spyOn(yurtService, 'addYurtToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sinif });
      comp.ngOnInit();

      expect(yurtService.query).toHaveBeenCalled();
      expect(yurtService.addYurtToCollectionIfMissing).toHaveBeenCalledWith(yurtCollection, ...additionalYurts);
      expect(comp.yurtsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Grup query and add missing value', () => {
      const sinif: ISinif = { id: 456 };
      const grup: IGrup = { id: 61785 };
      sinif.grup = grup;

      const grupCollection: IGrup[] = [{ id: 96226 }];
      jest.spyOn(grupService, 'query').mockReturnValue(of(new HttpResponse({ body: grupCollection })));
      const additionalGrups = [grup];
      const expectedCollection: IGrup[] = [...additionalGrups, ...grupCollection];
      jest.spyOn(grupService, 'addGrupToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sinif });
      comp.ngOnInit();

      expect(grupService.query).toHaveBeenCalled();
      expect(grupService.addGrupToCollectionIfMissing).toHaveBeenCalledWith(grupCollection, ...additionalGrups);
      expect(comp.grupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const sinif: ISinif = { id: 456 };
      const hoca: IUser = { id: 68572 };
      sinif.hoca = hoca;
      const ogrencilers: IUser[] = [{ id: 62263 }];
      sinif.ogrencilers = ogrencilers;

      const userCollection: IUser[] = [{ id: 35328 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [hoca, ...ogrencilers];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sinif });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sinif: ISinif = { id: 456 };
      const yurt: IYurt = { id: 29461 };
      sinif.yurt = yurt;
      const grup: IGrup = { id: 49441 };
      sinif.grup = grup;
      const hoca: IUser = { id: 12067 };
      sinif.hoca = hoca;
      const ogrencilers: IUser = { id: 93549 };
      sinif.ogrencilers = [ogrencilers];

      activatedRoute.data = of({ sinif });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sinif));
      expect(comp.yurtsSharedCollection).toContain(yurt);
      expect(comp.grupsSharedCollection).toContain(grup);
      expect(comp.usersSharedCollection).toContain(hoca);
      expect(comp.usersSharedCollection).toContain(ogrencilers);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sinif>>();
      const sinif = { id: 123 };
      jest.spyOn(sinifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sinif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sinif }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sinifService.update).toHaveBeenCalledWith(sinif);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sinif>>();
      const sinif = new Sinif();
      jest.spyOn(sinifService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sinif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sinif }));
      saveSubject.complete();

      // THEN
      expect(sinifService.create).toHaveBeenCalledWith(sinif);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sinif>>();
      const sinif = { id: 123 };
      jest.spyOn(sinifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sinif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sinifService.update).toHaveBeenCalledWith(sinif);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackYurtById', () => {
      it('Should return tracked Yurt primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackYurtById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackGrupById', () => {
      it('Should return tracked Grup primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackGrupById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedUser', () => {
      it('Should return option if no User is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedUser(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected User for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedUser(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this User is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedUser(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
