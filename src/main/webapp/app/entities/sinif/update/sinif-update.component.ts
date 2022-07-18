import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISinif, Sinif } from '../sinif.model';
import { SinifService } from '../service/sinif.service';
import { IYurt } from 'app/entities/yurt/yurt.model';
import { YurtService } from 'app/entities/yurt/service/yurt.service';
import { IGrup } from 'app/entities/grup/grup.model';
import { GrupService } from 'app/entities/grup/service/grup.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'jhi-sinif-update',
  templateUrl: './sinif-update.component.html',
})
export class SinifUpdateComponent implements OnInit {
  isSaving = false;

  yurtsSharedCollection: IYurt[] = [];
  grupsSharedCollection: IGrup[] = [];
  usersSharedCollection: IUser[] = [];

  dropdownSettings:IDropdownSettings;
  dropdownList:any[] = [];
  selectedItems:IUser[] = [];

  editForm = this.fb.group({
    id: [],
    isim: [null, [Validators.maxLength(500)]],
    konulimizjson: [null, [Validators.maxLength(5000)]],
    yurt: [],
    grup: [],
    hoca: [],
    ogrencilers: [],
  });

  constructor(
    protected sinifService: SinifService,
    protected yurtService: YurtService,
    protected grupService: GrupService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sinif }) => {
      this.updateForm(sinif);

      this.loadRelationshipsOptions();
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'login',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }


  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sinif = this.createFromForm();
    if (sinif.id !== undefined) {
      this.subscribeToSaveResponse(this.sinifService.update(sinif));
    } else {
      this.subscribeToSaveResponse(this.sinifService.create(sinif));
    }
  }

  trackYurtById(_index: number, item: IYurt): number {
    return item.id!;
  }

  trackGrupById(_index: number, item: IGrup): number {
    return item.id!;
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  getSelectedUser(option: IUser, selectedVals?: IUser[]): IUser {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISinif>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(sinif: ISinif): void {
    this.editForm.patchValue({
      id: sinif.id,
      isim: sinif.isim,
      konulimizjson: sinif.konulimizjson,
      yurt: sinif.yurt,
      grup: sinif.grup,
      hoca: sinif.hoca,
      ogrencilers: sinif.ogrencilers,
    });

    this.yurtsSharedCollection = this.yurtService.addYurtToCollectionIfMissing(this.yurtsSharedCollection, sinif.yurt);
    this.grupsSharedCollection = this.grupService.addGrupToCollectionIfMissing(this.grupsSharedCollection, sinif.grup);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      sinif.hoca,
      ...(sinif.ogrencilers ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.yurtService
      .query()
      .pipe(map((res: HttpResponse<IYurt[]>) => res.body ?? []))
      .pipe(map((yurts: IYurt[]) => this.yurtService.addYurtToCollectionIfMissing(yurts, this.editForm.get('yurt')!.value)))
      .subscribe((yurts: IYurt[]) => (this.yurtsSharedCollection = yurts));

    this.grupService
      .query()
      .pipe(map((res: HttpResponse<IGrup[]>) => res.body ?? []))
      .pipe(map((grups: IGrup[]) => this.grupService.addGrupToCollectionIfMissing(grups, this.editForm.get('grup')!.value)))
      .subscribe((grups: IGrup[]) => (this.grupsSharedCollection = grups));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(
            users,
            this.editForm.get('hoca')!.value,
            ...(this.editForm.get('ogrencilers')!.value ?? [])
          )
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ISinif {
    return {
      ...new Sinif(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
      konulimizjson: this.editForm.get(['konulimizjson'])!.value,
      yurt: this.editForm.get(['yurt'])!.value,
      grup: this.editForm.get(['grup'])!.value,
      hoca: this.editForm.get(['hoca'])!.value,
      ogrencilers: this.editForm.get(['ogrencilers'])!.value,
    };
  }
}
