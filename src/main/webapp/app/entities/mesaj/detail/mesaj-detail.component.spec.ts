import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MesajDetailComponent } from './mesaj-detail.component';

describe('Mesaj Management Detail Component', () => {
  let comp: MesajDetailComponent;
  let fixture: ComponentFixture<MesajDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesajDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mesaj: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MesajDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MesajDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mesaj on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mesaj).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
