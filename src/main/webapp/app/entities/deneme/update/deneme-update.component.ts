import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDeneme, Deneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISoru } from 'app/entities/soru/soru.model';
import { SoruService } from 'app/entities/soru/service/soru.service';

@Component({
  selector: 'jhi-deneme-update',
  templateUrl: './deneme-update.component.html',
})
export class DenemeUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  sorusSharedCollection: ISoru[] = [];

  editForm = this.fb.group({
    id: [],
    isim: [null, [Validators.maxLength(500)]],
    olusturmaTarih: [],
    baslamaTarih: [],
    sure: [],
    cevapAnahtar: [null, [Validators.maxLength(500)]],
    denemeInfoJson: [null, [Validators.maxLength(5000)]],
    olusturan: [],
    sorulars: [],
  });

  constructor(
    protected denemeService: DenemeService,
    protected userService: UserService,
    protected soruService: SoruService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deneme }) => {
      if (deneme.id === undefined) {
        const today = dayjs().startOf('day');
        deneme.baslamaTarih = today;
      }

      this.updateForm(deneme);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const deneme = this.createFromForm();
    if (deneme.id !== undefined) {
      this.subscribeToSaveResponse(this.denemeService.update(deneme));
    } else {
      this.subscribeToSaveResponse(this.denemeService.create(deneme));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  trackSoruById(_index: number, item: ISoru): number {
    return item.id!;
  }

  getSelectedSoru(option: ISoru, selectedVals?: ISoru[]): ISoru {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDeneme>>): void {
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

  protected updateForm(deneme: IDeneme): void {
    this.editForm.patchValue({
      id: deneme.id,
      isim: deneme.isim,
      olusturmaTarih: deneme.olusturmaTarih,
      baslamaTarih: deneme.baslamaTarih ? deneme.baslamaTarih.format(DATE_TIME_FORMAT) : null,
      sure: deneme.sure,
      cevapAnahtar: deneme.cevapAnahtar,
      denemeInfoJson: deneme.denemeInfoJson,
      olusturan: deneme.olusturan,
      sorulars: deneme.sorulars,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, deneme.olusturan);
    this.sorusSharedCollection = this.soruService.addSoruToCollectionIfMissing(this.sorusSharedCollection, ...(deneme.sorulars ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('olusturan')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.soruService
      .query()
      .pipe(map((res: HttpResponse<ISoru[]>) => res.body ?? []))
      .pipe(map((sorus: ISoru[]) => this.soruService.addSoruToCollectionIfMissing(sorus, ...(this.editForm.get('sorulars')!.value ?? []))))
      .subscribe((sorus: ISoru[]) => (this.sorusSharedCollection = sorus));
  }

  protected createFromForm(): IDeneme {
    return {
      ...new Deneme(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
      olusturmaTarih: this.editForm.get(['olusturmaTarih'])!.value,
      baslamaTarih: this.editForm.get(['baslamaTarih'])!.value
        ? dayjs(this.editForm.get(['baslamaTarih'])!.value, DATE_TIME_FORMAT)
        : undefined,
      sure: this.editForm.get(['sure'])!.value,
      cevapAnahtar: this.editForm.get(['cevapAnahtar'])!.value,
      denemeInfoJson: this.editForm.get(['denemeInfoJson'])!.value,
      olusturan: this.editForm.get(['olusturan'])!.value,
      sorulars: this.editForm.get(['sorulars'])!.value,
    };
  }
}
