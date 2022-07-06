import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DenemeAnalizDetailComponent } from './deneme-analiz-detail.component';

describe('DenemeAnaliz Management Detail Component', () => {
  let comp: DenemeAnalizDetailComponent;
  let fixture: ComponentFixture<DenemeAnalizDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DenemeAnalizDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ denemeAnaliz: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DenemeAnalizDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DenemeAnalizDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load denemeAnaliz on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.denemeAnaliz).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
