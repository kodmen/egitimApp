import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';

import { DenemeAnalizSinifComponent } from './deneme-analiz-sinif.component';

describe('DenemeAnalizSinif Management Component', () => {
  let comp: DenemeAnalizSinifComponent;
  let fixture: ComponentFixture<DenemeAnalizSinifComponent>;
  let service: DenemeAnalizSinifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DenemeAnalizSinifComponent],
    })
      .overrideTemplate(DenemeAnalizSinifComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DenemeAnalizSinifComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DenemeAnalizSinifService);

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
    expect(comp.denemeAnalizSinifs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
