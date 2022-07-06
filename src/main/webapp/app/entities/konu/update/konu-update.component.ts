import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IKonu, Konu } from '../konu.model';
import { KonuService } from '../service/konu.service';

@Component({
  selector: 'jhi-konu-update',
  templateUrl: './konu-update.component.html',
})
export class KonuUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    isim: [null, [Validators.maxLength(500)]],
  });

  constructor(protected konuService: KonuService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ konu }) => {
      this.updateForm(konu);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const konu = this.createFromForm();
    if (konu.id !== undefined) {
      this.subscribeToSaveResponse(this.konuService.update(konu));
    } else {
      this.subscribeToSaveResponse(this.konuService.create(konu));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKonu>>): void {
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

  protected updateForm(konu: IKonu): void {
    this.editForm.patchValue({
      id: konu.id,
      isim: konu.isim,
    });
  }

  protected createFromForm(): IKonu {
    return {
      ...new Konu(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
    };
  }
}
