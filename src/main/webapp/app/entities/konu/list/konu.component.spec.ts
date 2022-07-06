import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { KonuService } from '../service/konu.service';

import { KonuComponent } from './konu.component';

describe('Konu Management Component', () => {
  let comp: KonuComponent;
  let fixture: ComponentFixture<KonuComponent>;
  let service: KonuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KonuComponent],
    })
      .overrideTemplate(KonuComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KonuComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KonuService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.konus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
