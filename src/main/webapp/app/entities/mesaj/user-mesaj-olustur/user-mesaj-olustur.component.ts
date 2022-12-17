import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IMesaj, Mesaj } from '../mesaj.model';
import { MesajService } from '../service/mesaj.service';

@Component({
  selector: 'jhi-user-mesaj-olustur',
  templateUrl: './user-mesaj-olustur.component.html',
  styleUrls: ['./user-mesaj-olustur.component.scss'],
})
export class UserMesajOlusturComponent {
  isSend = false;
  editForm = this.fb.group({
    userName: [null,Validators.required],
    eposta: [null,Validators.required],
    mesaj: [null,Validators.required],
  });

  constructor(protected mesajService: MesajService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  save(): void {
    const mesaj = this.createFromForm();
    console.log(mesaj);
    if(this.editForm.status === "VALID"){
       this.mesajService.createMesajForUser(mesaj).subscribe(res => {
      this.isSend = true;
      console.log(res);
      this.formTemizle();
    });
    }
   
  }

  formTemizle(): void {
    this.editForm.patchValue({ userName: null, eposta: null, mesaj: null });
  }

  get userName():any { return this.editForm.get('userName'); }

  get eposta():any { return this.editForm.get('eposta'); }

  get mesaj():any { return this.editForm.get('mesaj'); }

  protected createFromForm(): IMesaj {
    return {
      ...new Mesaj(),
      userName: this.editForm.get(['userName'])!.value,
      eposta: this.editForm.get(['eposta'])!.value,
      mesaj: this.editForm.get(['mesaj'])!.value,
    };
  }
}
