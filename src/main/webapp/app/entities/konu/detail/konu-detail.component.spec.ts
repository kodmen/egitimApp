import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KonuDetailComponent } from './konu-detail.component';

describe('Konu Management Detail Component', () => {
  let comp: KonuDetailComponent;
  let fixture: ComponentFixture<KonuDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonuDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ konu: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KonuDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KonuDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load konu on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.konu).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
