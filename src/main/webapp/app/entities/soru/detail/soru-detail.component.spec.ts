import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SoruDetailComponent } from './soru-detail.component';

describe('Soru Management Detail Component', () => {
  let comp: SoruDetailComponent;
  let fixture: ComponentFixture<SoruDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoruDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ soru: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SoruDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SoruDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load soru on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.soru).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
