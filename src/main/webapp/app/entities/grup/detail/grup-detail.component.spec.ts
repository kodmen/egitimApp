import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrupDetailComponent } from './grup-detail.component';

describe('Grup Management Detail Component', () => {
  let comp: GrupDetailComponent;
  let fixture: ComponentFixture<GrupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
