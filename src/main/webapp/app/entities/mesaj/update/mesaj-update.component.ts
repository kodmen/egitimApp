import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMesaj, Mesaj } from '../mesaj.model';
import { MesajService } from '../service/mesaj.service';

@Component({
  selector: 'jhi-mesaj-update',
  templateUrl: './mesaj-update.component.html',
})
export class MesajUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    userName: [],
    eposta: [],
    mesaj: [],
    goruldu: [],
    tarih: [],
  });

  constructor(protected mesajService: MesajService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesaj }) => {
      this.updateForm(mesaj);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mesaj = this.createFromForm();
    if (mesaj.id !== undefined) {
      this.subscribeToSaveResponse(this.mesajService.update(mesaj));
    } else {
      this.subscribeToSaveResponse(this.mesajService.create(mesaj));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMesaj>>): void {
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

  protected updateForm(mesaj: IMesaj): void {
    this.editForm.patchValue({
      id: mesaj.id,
      userName: mesaj.userName,
      eposta: mesaj.eposta,
      mesaj: mesaj.mesaj,
      goruldu: mesaj.goruldu,
      tarih: mesaj.tarih,
    });
  }

  protected createFromForm(): IMesaj {
    return {
      ...new Mesaj(),
      id: this.editForm.get(['id'])!.value,
      userName: this.editForm.get(['userName'])!.value,
      eposta: this.editForm.get(['eposta'])!.value,
      mesaj: this.editForm.get(['mesaj'])!.value,
      goruldu: this.editForm.get(['goruldu'])!.value,
      tarih: this.editForm.get(['tarih'])!.value,
    };
  }
}
