import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DenemeAnalizSinifDetailComponent } from './deneme-analiz-sinif-detail.component';

describe('DenemeAnalizSinif Management Detail Component', () => {
  let comp: DenemeAnalizSinifDetailComponent;
  let fixture: ComponentFixture<DenemeAnalizSinifDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DenemeAnalizSinifDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ denemeAnalizSinif: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DenemeAnalizSinifDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DenemeAnalizSinifDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load denemeAnalizSinif on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.denemeAnalizSinif).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
