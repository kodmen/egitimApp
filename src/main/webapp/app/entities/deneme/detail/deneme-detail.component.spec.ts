import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DenemeDetailComponent } from './deneme-detail.component';

describe('Deneme Management Detail Component', () => {
  let comp: DenemeDetailComponent;
  let fixture: ComponentFixture<DenemeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DenemeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ deneme: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DenemeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DenemeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load deneme on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.deneme).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
