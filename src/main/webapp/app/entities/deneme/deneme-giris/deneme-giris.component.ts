import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';
import { IDeneme } from '../deneme.model';
import { DenemeService } from '../service/deneme.service';
import { DenemeCevapRequest } from './denemeCevap.model';
import { DenemeSinavDto, DenemeSoruDto } from './denemeSinav.model';

@Component({
  selector: 'jhi-ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Dikkat!</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p>Testi bitirmek istediğine emin misin!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="submit" class="btn btn-outline-danger" (click)="passBack()">Testi tamamla</button>

    </div>
  `
})
export class NgbdModalComponent {
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) {}

  
  passBack():void {
    this.passEntry.emit("tamamla");
    }

}



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
  time:number;
  deneme: IDeneme | null = null;

  constructor(
    private fb: FormBuilder,
    private denemeService: DenemeService,
    private route: ActivatedRoute,
    protected router: Router,
    private alertService: AlertService ,
    private modalService: NgbModal
     ) {
    this.p = 0;
    this.foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';
  }

  open():void {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      console.log(receivedEntry);
      this.save();
      this.modalService.dismissAll();
      })

  }

  getSorular(id: number): void {
    this.denemeService.getDenemeSinav(id).subscribe(res => {
      this.sinav = res;
      
      this.sinav.sorular = this.shuffleArray(this.sinav.sorular);
      for (let index = 0; index < this.sinav.sorular.length; index++) {
        this.addControl(this.sinav.sorular[index].soruId!);
      }
    });
  }

  shuffleArray(array: DenemeSoruDto[]): DenemeSoruDto[] {
    const karisikdizi: DenemeSoruDto[] = [];
    const arrayLength = array.length;
    
    for (let i = 0; i <arrayLength; i++) {
      const item = array[Math.floor(Math.random() * array.length)];
      karisikdizi.push(item);
      array = this.arrayRemove(array, item);
    }

    return karisikdizi;
  }

  arrayRemove(arr: DenemeSoruDto[], value: DenemeSoruDto):DenemeSoruDto[] {
    return arr.filter(function (ele) {
      return ele !== value;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
     if(params['sure']){
      this.time = params['sure']*60;
     }
  });
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

  handleEvent(event:any):any{
    console.log(event);
    
    if(event.action === 'done'){
      this.alertService.addAlert({ type: 'danger', message: 'Süre bitti' });

      
    }
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
        this.router.navigate(['deneme-analiz', res, 'view']);
      },
      err => {
        this.alertService.addAlert({ type: 'danger', message: 'serviste hata olustu' });
        console.log(err);
      }
    );
  }
}
