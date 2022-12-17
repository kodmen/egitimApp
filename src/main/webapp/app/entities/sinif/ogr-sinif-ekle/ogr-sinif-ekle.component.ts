import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SinifService } from '../service/sinif.service';

@Component({
  selector: 'jhi-ogr-sinif-ekle',
  templateUrl: './ogr-sinif-ekle.component.html',
  styleUrls: ['./ogr-sinif-ekle.component.scss'],
})
export class OgrSinifEkleComponent {
  isError = false;
  ErrorMessage: string;

  yurtKodForm = this.fb.group({
    sinifKod: ['', [Validators.required]],
  });

  constructor(private router: Router, private sinifService: SinifService, private fb: FormBuilder) {}

  save(): void {
    const kod: string = this.yurtKodForm.get(['sinifKod'])!.value;

    if (this.yurtKodForm.status === 'VALID') {
      this.sinifService.ogrSinifAta(kod).subscribe(
        res => {
          this.router.navigate(['sinif']);
        },
        err => {
          console.log('error');
          this.ErrorMessage = err.error.errorKey;
          this.isError = true;
        }
      );
    }
  }
}
