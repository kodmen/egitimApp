import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDenemeAnalizSinif, DenemeAnalizSinif } from '../deneme-analiz-sinif.model';
import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';
import { IDeneme } from 'app/entities/deneme/deneme.model';
import { DenemeService } from 'app/entities/deneme/service/deneme.service';
import { ISinif } from 'app/entities/sinif/sinif.model';
import { SinifService } from 'app/entities/sinif/service/sinif.service';

@Component({
  selector: 'jhi-deneme-analiz-sinif-update',
  templateUrl: './deneme-analiz-sinif-update.component.html',
})
export class DenemeAnalizSinifUpdateComponent implements OnInit {
  isSaving = false;

  denemesSharedCollection: IDeneme[] = [];
  sinifsSharedCollection: ISinif[] = [];

  editForm = this.fb.group({
    id: [],
    ortalama: [],
    konuAnalizJson: [null, [Validators.maxLength(5000)]],
    deneme: [],
    sinif: [],
  });

  constructor(
    protected denemeAnalizSinifService: DenemeAnalizSinifService,
    protected denemeService: DenemeService,
    protected sinifService: SinifService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ denemeAnalizSinif }) => {
      this.updateForm(denemeAnalizSinif);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const denemeAnalizSinif = this.createFromForm();
    if (denemeAnalizSinif.id !== undefined) {
      this.subscribeToSaveResponse(this.denemeAnalizSinifService.update(denemeAnalizSinif));
    } else {
      this.subscribeToSaveResponse(this.denemeAnalizSinifService.create(denemeAnalizSinif));
    }
  }

  trackDenemeById(_index: number, item: IDeneme): number {
    return item.id!;
  }

  trackSinifById(_index: number, item: ISinif): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDenemeAnalizSinif>>): void {
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

  protected updateForm(denemeAnalizSinif: IDenemeAnalizSinif): void {
    this.editForm.patchValue({
      id: denemeAnalizSinif.id,
      ortalama: denemeAnalizSinif.ortalama,
      konuAnalizJson: denemeAnalizSinif.konuAnalizJson,
      deneme: denemeAnalizSinif.deneme,
      sinif: denemeAnalizSinif.sinif,
    });

    this.denemesSharedCollection = this.denemeService.addDenemeToCollectionIfMissing(
      this.denemesSharedCollection,
      denemeAnalizSinif.deneme
    );
    this.sinifsSharedCollection = this.sinifService.addSinifToCollectionIfMissing(this.sinifsSharedCollection, denemeAnalizSinif.sinif);
  }

  protected loadRelationshipsOptions(): void {
    this.denemeService
      .query()
      .pipe(map((res: HttpResponse<IDeneme[]>) => res.body ?? []))
      .pipe(map((denemes: IDeneme[]) => this.denemeService.addDenemeToCollectionIfMissing(denemes, this.editForm.get('deneme')!.value)))
      .subscribe((denemes: IDeneme[]) => (this.denemesSharedCollection = denemes));

    this.sinifService
      .query()
      .pipe(map((res: HttpResponse<ISinif[]>) => res.body ?? []))
      .pipe(map((sinifs: ISinif[]) => this.sinifService.addSinifToCollectionIfMissing(sinifs, this.editForm.get('sinif')!.value)))
      .subscribe((sinifs: ISinif[]) => (this.sinifsSharedCollection = sinifs));
  }

  protected createFromForm(): IDenemeAnalizSinif {
    return {
      ...new DenemeAnalizSinif(),
      id: this.editForm.get(['id'])!.value,
      ortalama: this.editForm.get(['ortalama'])!.value,
      konuAnalizJson: this.editForm.get(['konuAnalizJson'])!.value,
      deneme: this.editForm.get(['deneme'])!.value,
      sinif: this.editForm.get(['sinif'])!.value,
    };
  }
}
