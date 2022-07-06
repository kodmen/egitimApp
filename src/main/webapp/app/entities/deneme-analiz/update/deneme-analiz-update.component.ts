import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDenemeAnaliz, DenemeAnaliz } from '../deneme-analiz.model';
import { DenemeAnalizService } from '../service/deneme-analiz.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDeneme } from 'app/entities/deneme/deneme.model';
import { DenemeService } from 'app/entities/deneme/service/deneme.service';

@Component({
  selector: 'jhi-deneme-analiz-update',
  templateUrl: './deneme-analiz-update.component.html',
})
export class DenemeAnalizUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  denemesSharedCollection: IDeneme[] = [];

  editForm = this.fb.group({
    id: [],
    dogru: [],
    yanlis: [],
    puan: [],
    cozuldu: [],
    konuAnalizJson: [null, [Validators.maxLength(5000)]],
    user: [],
    deneme: [],
  });

  constructor(
    protected denemeAnalizService: DenemeAnalizService,
    protected userService: UserService,
    protected denemeService: DenemeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ denemeAnaliz }) => {
      this.updateForm(denemeAnaliz);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const denemeAnaliz = this.createFromForm();
    if (denemeAnaliz.id !== undefined) {
      this.subscribeToSaveResponse(this.denemeAnalizService.update(denemeAnaliz));
    } else {
      this.subscribeToSaveResponse(this.denemeAnalizService.create(denemeAnaliz));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  trackDenemeById(_index: number, item: IDeneme): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDenemeAnaliz>>): void {
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

  protected updateForm(denemeAnaliz: IDenemeAnaliz): void {
    this.editForm.patchValue({
      id: denemeAnaliz.id,
      dogru: denemeAnaliz.dogru,
      yanlis: denemeAnaliz.yanlis,
      puan: denemeAnaliz.puan,
      cozuldu: denemeAnaliz.cozuldu,
      konuAnalizJson: denemeAnaliz.konuAnalizJson,
      user: denemeAnaliz.user,
      deneme: denemeAnaliz.deneme,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, denemeAnaliz.user);
    this.denemesSharedCollection = this.denemeService.addDenemeToCollectionIfMissing(this.denemesSharedCollection, denemeAnaliz.deneme);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.denemeService
      .query()
      .pipe(map((res: HttpResponse<IDeneme[]>) => res.body ?? []))
      .pipe(map((denemes: IDeneme[]) => this.denemeService.addDenemeToCollectionIfMissing(denemes, this.editForm.get('deneme')!.value)))
      .subscribe((denemes: IDeneme[]) => (this.denemesSharedCollection = denemes));
  }

  protected createFromForm(): IDenemeAnaliz {
    return {
      ...new DenemeAnaliz(),
      id: this.editForm.get(['id'])!.value,
      dogru: this.editForm.get(['dogru'])!.value,
      yanlis: this.editForm.get(['yanlis'])!.value,
      puan: this.editForm.get(['puan'])!.value,
      cozuldu: this.editForm.get(['cozuldu'])!.value,
      konuAnalizJson: this.editForm.get(['konuAnalizJson'])!.value,
      user: this.editForm.get(['user'])!.value,
      deneme: this.editForm.get(['deneme'])!.value,
    };
  }
}
