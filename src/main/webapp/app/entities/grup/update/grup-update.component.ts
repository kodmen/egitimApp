import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGrup, Grup } from '../grup.model';
import { GrupService } from '../service/grup.service';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'jhi-grup-update',
  templateUrl: './grup-update.component.html',
})
export class GrupUpdateComponent implements OnInit {
  isSaving = false;

  konusSharedCollection: IKonu[] = [];
  dropdownSettings:IDropdownSettings;

  editForm = this.fb.group({
    id: [],
    isim: [null, [Validators.maxLength(500)]],
    konular: [],
  });

  constructor(protected konuService:KonuService,protected grupService: GrupService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadRelationshipsOptions();
    this.activatedRoute.data.subscribe(({ grup }) => {
      this.updateForm(grup);
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'isim',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  trackKonuById(_index: number, item: IKonu): number {
    return item.id!;
  }

  getSelectedKonu(option: IKonu, selectedVals?: IKonu[]): IKonu {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grup = this.createFromForm();
    if (grup.id !== undefined) {
      this.subscribeToSaveResponse(this.grupService.update(grup));
    } else {
      this.subscribeToSaveResponse(this.grupService.create(grup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrup>>): void {
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

  protected updateForm(grup: IGrup): void {
    this.editForm.patchValue({
      id: grup.id,
      isim: grup.isim,
      konular: grup.konular
    });
    this.konusSharedCollection = this.konuService.addKonuToCollectionIfMissing(
      this.konusSharedCollection,
      ...(grup.konular ?? [])
    );
  }

  protected createFromForm(): IGrup {
    return {
      ...new Grup(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
      konular: this.editForm.get(['konular'])!.value
    };
  }

  protected loadRelationshipsOptions(): void {
    this.konuService
    .query()
    .pipe(map((res:HttpResponse<IKonu[]>) => res.body ?? []))
    .pipe(map((konular:IKonu[]) => this.konuService.addKonuToCollectionIfMissing(konular,this.editForm.get('konular')!.value)))
    .subscribe((konular:IKonu[]) => (this.konusSharedCollection = konular));
  }
}
