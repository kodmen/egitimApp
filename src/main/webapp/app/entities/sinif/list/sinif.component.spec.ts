import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SinifService } from '../service/sinif.service';

import { SinifComponent } from './sinif.component';

describe('Sinif Management Component', () => {
  let comp: SinifComponent;
  let fixture: ComponentFixture<SinifComponent>;
  let service: SinifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SinifComponent],
    })
      .overrideTemplate(SinifComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SinifComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SinifService);

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
    expect(comp.sinifs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
