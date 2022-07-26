import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { YurtService } from 'app/entities/yurt/service/yurt.service';
import { IYurt } from 'app/entities/yurt/yurt.model';
import { map } from 'rxjs';
import { SinifService } from '../service/sinif.service';
import { ISinif } from '../sinif.model';

@Component({
  selector: 'jhi-ogr-sinif-ekle',
  templateUrl: './ogr-sinif-ekle.component.html',
  styleUrls: ['./ogr-sinif-ekle.component.scss'],
})
export class OgrSinifEkleComponent implements OnInit {
  yurtsSharedCollection: IYurt[] = [];
  sinifsSharedCollection: ISinif[] = [];
  isSaving = false;

  editForm = this.fb.group({
    yurt: ["",[Validators.required]],
    sinif: ["",[Validators.required]],
  });

  constructor(private router:Router,private yurtService: YurtService, private sinifService: SinifService, private fb: FormBuilder) {}

  onChange(deviceValue:any):void {
    console.log(deviceValue);
    const yurt = this.editForm.get(['yurt'])!.value;
  
    //burda secilen sinifin yurtlarını getirmeliyiz
    if(this.editForm.get(['yurt'])!.value){
      this.sinifService.getSinifByYurtId(yurt.id).subscribe(res=>{
        this.sinifsSharedCollection = res.body!;
        console.log("sinif geldi");
        console.log(this.sinifsSharedCollection);
        
      })
    }else{
      this.sinifsSharedCollection = [];
    }
}

  ngOnInit(): void {
    this.loadRelationshipsOptions();
  }

  trackYurtById(_index: number, item: IYurt): number {
    return item.id!;
  }

  trackSinifById(_index: number, item: ISinif): number {
    return item.id!;
  }

  save():void{
    console.log("eklendi");

    if(this.editForm.invalid){
        const yurt = this.editForm.get(['yurt'])!.value;
    const sinif = this.editForm.get(['sinif'])!.value;

    this.sinifService.ogrSinifAta(sinif.id).subscribe(res=>{
      console.log("ogrenci sinifa eklendi");
      this.router.navigate(['sinif']);
    })
    }

  
    
  }

  protected loadRelationshipsOptions(): void {
       this.yurtService
      .query()
      .pipe(map((res: HttpResponse<IYurt[]>) => res.body ?? []))
      .pipe(map((yurts: IYurt[]) => this.yurtService.addYurtToCollectionIfMissing(yurts, this.editForm.get('yurt')!.value)))
      .subscribe((yurts: IYurt[]) => (this.yurtsSharedCollection = yurts));
  }


}
