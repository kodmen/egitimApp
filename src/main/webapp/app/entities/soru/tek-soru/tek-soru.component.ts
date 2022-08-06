import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SoruService } from '../service/soru.service';
import { ISoru } from '../soru.model';

@Component({
  selector: 'jhi-tek-soru',
  templateUrl: './tek-soru.component.html',
  styleUrls: ['./tek-soru.component.scss'],
})
export class TekSoruComponent implements OnInit {
  soru?: ISoru;
  defaultImage = '../../../../content/images/loading.gif';
  foto = 'https://temrinbucket.s3.eu-central-1.amazonaws.com/';

  constructor(private route: ActivatedRoute, private soruService: SoruService) {}

  ngOnInit(): void {
    // paramdan gelen soru id al
    this.route.params.subscribe(params => {
      if (params['isim']) {
        console.log("gelen isim");
        console.log(params['isim']);
        
        this.getSoru(params['isim'].trim())
      }
    });
  }

  getSoru(isim: string): void {
    this.soruService.getSoruByIsim(isim).subscribe(res => {
      this.soru = res.body!;
    });
  }

  getCevapClassAta(sik:string):string{
    //sık girilcek eğer cevapsa doğru dönsün değilse yanlış dönsün
    if(sik === this.soru?.cevap ){
      return 'bg-success';
    }
  return ""
   
  }

}
