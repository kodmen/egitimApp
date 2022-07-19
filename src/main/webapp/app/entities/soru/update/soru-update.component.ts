import {Component, ElementRef, OnInit} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISoru, Soru } from '../soru.model';
import { SoruService } from '../service/soru.service';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

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
    a: [],
    b: [],
    c: [],
    d: [],
    cevapli: [],
    konu: [],
    imageContentType: [],
    image: [],
  });

  constructor(
    protected soruService: SoruService,
    protected konuService: KonuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected elementRef: ElementRef
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

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('temrinMatikApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
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
      a: soru.a,
      b: soru.b,
      c: soru.c,
      d: soru.d,
      cevapli: soru.cevapli,
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
      a: this.editForm.get(['a'])!.value,
      b: this.editForm.get(['b'])!.value,
      c: this.editForm.get(['c'])!.value,
      d: this.editForm.get(['d'])!.value,
      cevapli: this.editForm.get(['cevapli'])!.value,
      konu: this.editForm.get(['konu'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
    };
  }
}
