import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'app/config/environment';
import {Banner} from './banner.model';
@Component({
  selector: 'jhi-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements AfterViewInit {

  @Input() banner: Banner;
  showAd = environment.adsense.show;
      
  
      ngAfterViewInit():void {
          setTimeout(() => {
              try {
                  (window['adsbygoogle'] = window['adsbygoogle'] || []).push({
                      overlays: {bottom: true}
                  });
              } catch (e) {
                  console.error(e);
              }
          }, 0);
      }
  

}
