import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventWithContent, EventManager } from 'app/core/util/event-manager.service';
import { IDonem } from 'app/entities/donem/donem.model';
import { DonemService } from 'app/entities/donem/service/donem.service';
import { IKonu } from 'app/entities/konu/konu.model';
import { KonuService } from 'app/entities/konu/service/konu.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { finalize, map, Observable } from 'rxjs';
import { SoruService } from '../service/soru.service';
import { TekliSoru } from '../TekliSoru.model';
import { TopluSoru } from '../TopluSoru.model';

@Component({
  selector: 'jhi-toplu-soru-ekleme',
  templateUrl: './toplu-soru-ekleme.component.html',
  styleUrls: ['./toplu-soru-ekleme.component.scss']
})
export class TopluSoruEklemeComponent implements OnInit {

  topluSoru = this.fb.group({
    sorular: this.fb.array([]),
    cevapli: [],
    konu: [],
    donem: [],
    metinliSorular:[]
  });
  konusSharedCollection: IKonu[] = [];
  donemsSharedCollection: IDonem[] = [];

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  yukleniyor = false;

  constructor(protected fb: FormBuilder,
    protected konuService: KonuService,
    protected donemService: DonemService,
    protected soruService: SoruService,
    protected eventManager: EventManager,
    protected dataUtils: DataUtils) { }

  ngOnInit(): void {
    this.loadRelationshipsOptions();
    //this.imageInfos = this.soruService.getFiles();
  }

  get sorularFieldAsFormArray(): FormArray {
    return this.topluSoru.get('sorular') as FormArray;
  }

  selectFiles(event: any): void {
    console.log("buraya giriyor");

    this.dataUtils.loadFileToFormArray(event, this.sorularFieldAsFormArray, this.fb, 'image', true).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('temrinMatikApp.error', { ...err, key: 'error.file.' + err.key })),
    });

  }

  save(): void {
    if (!this.yukleniyor) {
      console.log("buraya girdik")
      const resimler = this.createFromForm();

      this.yukleniyor = true;
      this.soruService.topluResimYukle(resimler).pipe(
        finalize(() => this.yukleniyor = false)
      ).subscribe(res => {
        console.log(res);
        this.formBosalit();
      }

      )
    }

  }

  formBosalit(): void {
    this.topluSoru.patchValue({ konu: null, donem: null, metinliSorular:null});
    
    for (let index = 0; index < this.sorularFieldAsFormArray.controls.length; index++) {
      const element = this.sorularFieldAsFormArray.controls[index];      
      element.patchValue({name:'',type:'',resim:''})
    }

  }

  trackKonuById(_index: number, item: IKonu): number {
    return item.id!;
  }

  trackDonemById(_index: number, item: IDonem): number {
    return item.id!;
  }


  protected createFromForm(): TopluSoru {

    const konular = new Array<TekliSoru>();
    const forkKonular = this.topluSoru.get(['sorular'])!.value;

    for (let i = 0; i < forkKonular.length; i++) {
      const element = forkKonular[i];
      konular.push(new TekliSoru(element.name, element.type, element.resim));
    }

    return new TopluSoru(
      this.topluSoru.get(['cevapli'])!.value,
      this.topluSoru.get(['konu'])!.value,
      this.topluSoru.get(['donem'])!.value,
      konular,
      this.topluSoru.get(['metinliSorular'])!.value
    );
  }

  protected loadRelationshipsOptions(): void {
    this.konuService
      .query()
      .pipe(map((res: HttpResponse<IKonu[]>) => res.body ?? []))
      .pipe(map((konus: IKonu[]) => this.konuService.addKonuToCollectionIfMissing(konus, this.topluSoru.get('konu')!.value)))
      .subscribe((konus: IKonu[]) => (this.konusSharedCollection = konus));

    this.donemService
      .query()
      .pipe(map((res: HttpResponse<IDonem[]>) => res.body ?? []))
      .pipe(map((donems: IDonem[]) => this.donemService.addDonemToCollectionIfMissing(donems, this.topluSoru.get('donem')!.value)))
      .subscribe((donems: IDonem[]) => (this.donemsSharedCollection = donems));
  }

}
