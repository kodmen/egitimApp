import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISoru, Soru } from '../soru.model';
import { SoruService } from '../service/soru.service';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';

@Component({
  selector: 'jhi-soru-update',
  templateUrl: './soru-update.component.html',
})
export class SoruUpdateComponent implements OnInit {
  isSaving = false;

  konusSharedCollection: IKonu[] = [];

  editForm = this.fb.group({
    id: [],
    isim: [null, [Validators.maxLength(500)]],
    cevap: [],
    sira: [],
    resimUrl: [null, [Validators.maxLength(500)]],
    konu: [],
  });

  constructor(
    protected soruService: SoruService,
    protected konuService: KonuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ soru }) => {
      this.updateForm(soru);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const soru = this.createFromForm();
    if (soru.id !== undefined) {
      this.subscribeToSaveResponse(this.soruService.update(soru));
    } else {
      this.subscribeToSaveResponse(this.soruService.create(soru));
    }
  }

  trackKonuById(_index: number, item: IKonu): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISoru>>): void {
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

  protected updateForm(soru: ISoru): void {
    this.editForm.patchValue({
      id: soru.id,
      isim: soru.isim,
      cevap: soru.cevap,
      sira: soru.sira,
      resimUrl: soru.resimUrl,
      konu: soru.konu,
    });

    this.konusSharedCollection = this.konuService.addKonuToCollectionIfMissing(this.konusSharedCollection, soru.konu);
  }

  protected loadRelationshipsOptions(): void {
    this.konuService
      .query()
      .pipe(map((res: HttpResponse<IKonu[]>) => res.body ?? []))
      .pipe(map((konus: IKonu[]) => this.konuService.addKonuToCollectionIfMissing(konus, this.editForm.get('konu')!.value)))
      .subscribe((konus: IKonu[]) => (this.konusSharedCollection = konus));
  }

  protected createFromForm(): ISoru {
    return {
      ...new Soru(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
      cevap: this.editForm.get(['cevap'])!.value,
      sira: this.editForm.get(['sira'])!.value,
      resimUrl: this.editForm.get(['resimUrl'])!.value,
      konu: this.editForm.get(['konu'])!.value,
    };
  }
}
