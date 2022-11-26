import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DonemDetailComponent } from './donem-detail.component';

describe('Donem Management Detail Component', () => {
  let comp: DonemDetailComponent;
  let fixture: ComponentFixture<DonemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ donem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DonemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DonemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load donem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.donem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
