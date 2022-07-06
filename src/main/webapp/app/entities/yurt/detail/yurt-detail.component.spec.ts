import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { YurtDetailComponent } from './yurt-detail.component';

describe('Yurt Management Detail Component', () => {
  let comp: YurtDetailComponent;
  let fixture: ComponentFixture<YurtDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YurtDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ yurt: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(YurtDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(YurtDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load yurt on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.yurt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
