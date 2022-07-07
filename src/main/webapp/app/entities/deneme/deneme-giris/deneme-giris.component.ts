import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/core/util/alert.service';
import { DenemeService } from '../service/deneme.service';
import { DenemeCevapRequest } from './denemeCevap.model';
import { DenemeSinavDto } from './denemeSinav.model';

@Component({
  selector: 'jhi-deneme-giris',
  templateUrl: './deneme-giris.component.html',
  styleUrls: ['./deneme-giris.component.scss'],
})
export class DenemeGirisComponent implements OnInit {
  p: number;
  form: FormGroup;
  denemeId: number;
  sinav: DenemeSinavDto;
  foto: string;

  constructor(private fb: FormBuilder, private denemeService: DenemeService, private route: ActivatedRoute, protected router: Router,private alertService: AlertService) {
    this.p = 0;
    this.foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';
  }

  getSorular(id: number): void {
    this.denemeService.getDenemeSinav(id).subscribe(res => {
      this.sinav = res;
      console.log(res);

      for (let index = 0; index < this.sinav.sorular.length; index++) {
        this.addControl(this.sinav.sorular[index].soruId!);
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.getSorular(params['id']);
        this.denemeId = params['id'];
      } else {
        console.log('geldim hata');
      }
    });

    this.form = this.fb.group({
      denemeId: [this.denemeId, { validators: [Validators.required] }],
      sorular: this.fb.array([]),
    });
  }

  get cevaplarFieldAsFormArray(): any {
    return this.form.get('sorular') as FormArray;
  }

  addControl(id: number): void {
    this.cevaplarFieldAsFormArray.push(this.soruCevap(id));
  }

  soruCevap(id: number): any {
    return this.fb.group({
      cevap: this.fb.control(''),
      soruId: this.fb.control(id),
    });
  }

  save(): void {
    const cevapRequest = new DenemeCevapRequest(this.form.value);
    this.denemeService.cevaplariGonder(cevapRequest).subscribe(
      res => {
        
          this.router.navigate(['deneme-analiz',res ,'view']);
        
      },
      err => {
        this.alertService.addAlert({ type: 'danger', message: 'serviste hata olustu' });
        console.log(err);
      }
    );
  }
}
