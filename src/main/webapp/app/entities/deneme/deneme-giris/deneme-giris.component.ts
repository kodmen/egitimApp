import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';
import { IDeneme } from '../deneme.model';
import { DenemeKaristirService } from '../service/deneme-karistir.service';
import { DenemeService } from '../service/deneme.service';
import { DenemeCevapRequest } from './denemeCevap.model';
import { DenemeSinavDto } from './denemeSinav.model';
import { NgbdModalComponent } from './NgbdModalComponent';

@Component({
  selector: 'jhi-deneme-giris',
  templateUrl: './deneme-giris.component.html',
  styleUrls: ['./deneme-giris.component.scss'],
})
export class DenemeGirisComponent implements OnInit,AfterViewInit {

  ms:any =  0;
  sec:any =  0;
  min:any =  0;
  hr:any =  0;
  timer = 0;

  startTime:any;
  olusturan:string;


  p: number;
  form: FormGroup;
  denemeId: number;
  sinav: DenemeSinavDto;
  foto: string;
  time: number;
  deneme: IDeneme | null = null;

  constructor(
    private fb: FormBuilder,
    private denemeService: DenemeService,
    private route: ActivatedRoute,
    protected router: Router,
    private alertService: AlertService,
    private modalService: NgbModal,
    private karistirService:DenemeKaristirService
  ) {
    this.p = 0;
    this.foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';
  }

  ngAfterViewInit():void {
    this.startTime = setInterval(()=>{
      this.timer++;
      this.ms++;
      this.ms = this.ms < 10 ?  this.ms : this.ms;

      if(this.ms === 100){
        this.sec ++;
        this.sec = this.sec < 10 ?   this.sec % 10 : this.sec;
        this.ms = 0;
      }

      if(this.sec === 60){
        this.min++;
        this.min = this.min < 10 ?  this.min : this.min;
        this.sec = 0;
      }
      if(this.min === 60){
        this.hr++;
        this.hr = this.hr < 10 ?  this.hr: this.hr;
        this.min = 0;
      }
    },10);
  }

  ngOnInit(): void {

    // parametreleri almak için
    this.route.queryParams.subscribe(params => {
      if (params['sure']) {
        this.time = params['sure'] * 60;
      }
    });

    // urlde slash işaretinden sonrasını almak için
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.getSorular(params['id']);
        this.denemeId = params['id'];

        this.denemeService.denemeyiGirmismi(this.denemeId).subscribe(res=>{
          if(res){
            this.alertService.addAlert({ type: 'danger', message: 'denemeye daha önce giriş yapmışsınız' });
            this.router.navigate(['/deneme/ogr'],{queryParams:{dahaOnceGirmis:true}});
            this.alertService.addAlert({ type: 'danger', message: 'denemeye daha önce giriş yapmışsınız' });

          }
        })


      } else {
        console.log('geldim hata');
      }
    });

    this.form = this.fb.group({
      sure:[],
      denemeId: [this.denemeId, { validators: [Validators.required] }],
      sorular: this.fb.array([]),
    });
  }


  /**
   * soruyu tamamlama modal
   */
  open(): void {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      console.log(receivedEntry);
      this.save();
      this.modalService.dismissAll();
    });
  }

  /**
   * soruları backenden getiriyor
   * @param id 
   */
  getSorular(id: number): void {
    this.denemeService.getDenemeSinav(id).subscribe(res => {
      this.sinav = res;
      this.olusturan = res.olusturan!;
      // sorular karıştılıyor
      this.sinav.sorular = this.karistirService.shuffleArray(this.sinav.sorular);

      for (let index = 0; index < this.sinav.sorular.length; index++) {
        this.addControl(this.sinav.sorular[index].soruId!);
      }
    });
  }

  /**
   * süre bittiği zaman ekrana alert fırlatıyor
   * @param event gelen durum
   */
  handleEvent(event: any): any {
    if (event.action === 'done') {
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
    const sure = this.timer;
    this.form.get(['sure'])!.setValue(sure);
    
    const cevapRequest = new DenemeCevapRequest(this.form.value);
    const duzenlenmisCevapRequest = this.karistirService.cevapDegistir(cevapRequest,this.sinav);

    this.denemeService.cevaplariGonder(duzenlenmisCevapRequest).subscribe(
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
