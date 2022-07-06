import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';

import { DenemeService } from '../service/deneme.service';
import { UserService } from 'app/entities/user/user.service';
import { SoruService } from 'app/entities/soru/service/soru.service';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';
import { DenemeDto } from '../denemeDto.model';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

@Component({
  selector: 'jhi-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  isSaving = false;
  konularSharedCollection: IKonu[] = [];

  editForm = this.fb.group({
    rastgele: [],
    isim: [null, [Validators.maxLength(500)]],
    baslamaTarih: [],
    sure: [],
    konudto: [],
  });

  form: FormGroup;

  constructor(
    protected denemeService: DenemeService,
    protected userService: UserService,
    protected soruService: SoruService,
    protected konuService: KonuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected router: Router
  ) {
    this.form = this.fb.group({
      baslamaTarih: ['', { validators: [Validators.required] }],
      sure: ['', { validators: [Validators.required] }],
      rastgele: ['false'],
      isim: [null, [Validators.maxLength(500)]],
      konudto: this.fb.array([]),
    });
  }

  get cevaplarFieldAsFormArray(): any {
    return this.form.get('konudto') as FormArray;
  }

  dersekle(): void {
    this.cevaplarFieldAsFormArray.push(this.soruCevap());
  }

  soruCevap(): any {
    return this.fb.group({
      konu: this.fb.control(''),
      soruSayisi: this.fb.control(''),
      baslangic: this.fb.control(''),
      bitis: this.fb.control(''),
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

  save(): void {
    // console.log(this.form);
    //       deneme.baslamaTarih = today;
    this.editForm.get(['baslamaTarih'])?.setValue(dayjs(this.editForm.get(['baslamaTarih'])!.value, DATE_TIME_FORMAT));
    const deneme = new DenemeDto(this.form.value);
    console.log(deneme);
    this.denemeService.createDto(deneme).subscribe(res => {
      // denemeler sayfasına gitmesi lazım
      console.log(res);

      this.router.navigate(['deneme']);
    });
  }

}
