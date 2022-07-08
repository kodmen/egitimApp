import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DenemeService } from '../service/deneme.service';
import { UserService } from 'app/entities/user/user.service';
import { SoruService } from 'app/entities/soru/service/soru.service';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';
import { DenemeDto } from '../denemeDto.model';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { AlertService } from 'app/core/util/alert.service';
import { KonuDto } from '../konuDto.model';

@Component({
  selector: 'jhi-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isSaving = false;
  konularSharedCollection: IKonu[] = [];
  form: FormGroup;

  constructor(
    protected denemeService: DenemeService,
    protected userService: UserService,
    protected soruService: SoruService,
    protected konuService: KonuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected router: Router,
    protected alertService: AlertService
  ) {
    this.form = this.fb.group({
      baslamaTarih: ['', { validators: [Validators.required] }],
      sure: ['', { validators: [Validators.required] }],
      rastgele: ['false'],
      isim: [null, [Validators.required, Validators.maxLength(500)]],
      konudto: this.fb.array([]),
    });
  }

  get cevaplarFieldAsFormArray(): any {
    return this.form.get('konudto') as FormArray;
  }

  dersekle(): void {
    this.cevaplarFieldAsFormArray.push(this.soruCevap());
  }

  dersleriKontrolet(): void {
    this.cevaplarFieldAsFormArray;
  }

  dersSil(id: number): void {
    this.cevaplarFieldAsFormArray.removeAt(id);
  }

  soruCevap(): any {
    return this.fb.group({
      konu: ['', { validators: [Validators.required] }],
      soruSayisi: ['', { validators: [Validators.required] }],
      baslangic: ['', { validators: [Validators.required] }],
      bitis: ['', { validators: [Validators.required] }],
    });
  }

  getKonu(): any {
    this.konuService.query().subscribe(res => {
      this.konularSharedCollection = res.body ?? [];
    });
  }

  ngOnInit(): void {
    this.getKonu();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  save(): void {
    if (this.form.status === 'INVALID') {
      if (this.f.baslamaTarih.status === 'INVALID') {
        this.alertService.addAlert({ type: 'danger', message: 'başlama tarihi boş bırakmayın' });
      }
      if (this.f.konudto.status === 'INVALID') {
        this.alertService.addAlert({ type: 'danger', message: 'konu alanlarını boş bırakmayın' });
      }
    } else {
    
      const deneme = this.createFromForm();
  
      this.denemeService.createDto(deneme).subscribe(res => {
        console.log(res);

        this.router.navigate(['deneme']);
      });
    }
  }

  protected createFromForm(): DenemeDto {
    const konular = new Array<KonuDto>();
    const forkKonular = this.form.get(['konudto'])!.value;

    for (let i = 0; i < forkKonular.length; i++) {
      const element = forkKonular[i];
      konular.push(new KonuDto(element.soruSayisi, element.baslangic, element.bitis, element.konu));
    }

    return new DenemeDto(
      this.form.get(['rastgele'])!.value,
      this.form.get(['isim'])!.value,
      this.form.get(['baslamaTarih'])!.value ? dayjs(this.form.get(['baslamaTarih'])!.value, DATE_TIME_FORMAT) : undefined,
      this.form.get(['sure'])!.value,
      konular
    );
  }
}
