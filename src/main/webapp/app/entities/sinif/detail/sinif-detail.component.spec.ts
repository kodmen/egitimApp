import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SinifDetailComponent } from './sinif-detail.component';

describe('Sinif Management Detail Component', () => {
  let comp: SinifDetailComponent;
  let fixture: ComponentFixture<SinifDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinifDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sinif: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SinifDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SinifDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sinif on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sinif).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
