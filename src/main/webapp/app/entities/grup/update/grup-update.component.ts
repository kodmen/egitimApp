import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IGrup, Grup } from '../grup.model';
import { GrupService } from '../service/grup.service';

@Component({
  selector: 'jhi-grup-update',
  templateUrl: './grup-update.component.html',
})
export class GrupUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    isim: [null, [Validators.maxLength(500)]],
  });

  constructor(protected grupService: GrupService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grup }) => {
      this.updateForm(grup);
    });
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
    });
  }

  protected createFromForm(): IGrup {
    return {
      ...new Grup(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
    };
  }
}
