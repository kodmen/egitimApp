import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IYurt, Yurt } from '../yurt.model';
import { YurtService } from '../service/yurt.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-yurt-update',
  templateUrl: './yurt-update.component.html',
})
export class YurtUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    isim: [null, [Validators.maxLength(500)]],
    mesul: [],
  });

  constructor(
    protected yurtService: YurtService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ yurt }) => {
      this.updateForm(yurt);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const yurt = this.createFromForm();
    if (yurt.id !== undefined) {
      this.subscribeToSaveResponse(this.yurtService.update(yurt));
    } else {
      this.subscribeToSaveResponse(this.yurtService.create(yurt));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IYurt>>): void {
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

  protected updateForm(yurt: IYurt): void {
    this.editForm.patchValue({
      id: yurt.id,
      isim: yurt.isim,
      mesul: yurt.mesul,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, yurt.mesul);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .getMesul()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('mesul')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IYurt {
    return {
      ...new Yurt(),
      id: this.editForm.get(['id'])!.value,
      isim: this.editForm.get(['isim'])!.value,
      mesul: this.editForm.get(['mesul'])!.value,
    };
  }
}
