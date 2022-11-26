import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDonem, Donem } from '../donem.model';
import { DonemService } from '../service/donem.service';

@Component({
  selector: 'jhi-donem-update',
  templateUrl: './donem-update.component.html',
})
export class DonemUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    isim: [],
  });

  constructor(protected donemService: DonemService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donem }) => {
      this.updateForm(donem);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const donem = this.createFromForm();
    if (donem.id !== undefined) {
      this.subscribeToSaveResponse(this.donemService.update(donem));
    } else {
      this.subscribeToSaveResponse(this.donemService.create(donem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDonem>>): void {
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

  protected updateForm(donem: IDonem): void {
    this.editForm.patchValue({
      id: donem.id,
      isim: donem.isim,
    });
  }

  protected createFromForm(): IDonem {
    return {
      ...new Donem(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
    };
  }
}
