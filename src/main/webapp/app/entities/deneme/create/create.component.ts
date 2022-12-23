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
import { ISinif, Sinif } from 'app/entities/sinif/sinif.model';
import { SinifService } from 'app/entities/sinif/service/sinif.service';
import { HttpResponse } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'jhi-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isSaving = false;
  konularSharedCollection: IKonu[] = [];
  form: FormGroup;

  isLoading = false;

  siniflar?: Sinif[] = [];
  seciliSinif?: Sinif | null;
  seciliSinifGelen?: Sinif | null;

  tekSinifVar = false;

  dropdownSettings: IDropdownSettings;

  constructor(
    protected denemeService: DenemeService,
    protected userService: UserService,
    protected sinifService: SinifService,
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
      sinifId: [''],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'isim',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };
  }

  sinifGetir(any: any): void {
    // burda gelenden aldığımız için sadece isim ve id var

    if (this.seciliSinif !== any) {
      this.seciliSinif = any;
      this.seciliSinifGelen = this.siniflar?.find(s => s.id === this.seciliSinif?.id);

      if (this.seciliSinifGelen?.grup?.id) {
        this.getKonuByMultiSinif(this.seciliSinifGelen?.grup?.id);
      }
    }
  }

  selectDegisti(formgurup: FormGroup): void {
    const kId: number = formgurup.value.konu;
    const k = this.konularSharedCollection.find(konu => konu.id === Number(kId));
    formgurup.get('secildi')?.setValue(true);
    formgurup.get('konuSoruSayisi')?.setValue(k?.soruSayisi);
    formgurup.get('bitis')?.setValue(k?.soruSayisi);
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
      baslangic: [0, { validators: [Validators.required] }],
      bitis: ['', { validators: [Validators.required] }],
      secildi: [false],
      konuSoruSayisi: [0],
    });
  }

  getKonuByMultiSinif(grupId: number): any {
    this.konuService.findByGrupId(grupId).subscribe(res => {
      this.konularSharedCollection = res.body ?? [];
    });
  }

  getKonu(): any {
    this.konuService.query().subscribe(res => {
      this.konularSharedCollection = res.body ?? [];
    });
  }

  ngOnInit(): void {

    this.sinifService.query().subscribe({
      next: (res: HttpResponse<ISinif[]>) => {
        this.isLoading = false;
        this.siniflar = res.body ?? [];

        if (this.siniflar.length <= 1) {
          this.tekSinifVar = false;
          if (this.siniflar.length === 1) {
            if (this.siniflar[0].grup?.id) {
              this.getKonuByMultiSinif(this.siniflar[0].grup?.id);
              this.seciliSinifGelen = this.siniflar[0];
            }
          }
        } else {
          this.tekSinifVar = true;
        }
      },
      error: () => {
        console.log('hata aldık');

        this.isLoading = false;
      },
    });
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
      deneme.sinifId = this.seciliSinifGelen?.id;
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
