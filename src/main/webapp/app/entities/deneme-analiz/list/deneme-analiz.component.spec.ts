import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DenemeAnalizService } from '../service/deneme-analiz.service';

import { DenemeAnalizComponent } from './deneme-analiz.component';

describe('DenemeAnaliz Management Component', () => {
  let comp: DenemeAnalizComponent;
  let fixture: ComponentFixture<DenemeAnalizComponent>;
  let service: DenemeAnalizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DenemeAnalizComponent],
    })
      .overrideTemplate(DenemeAnalizComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DenemeAnalizComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DenemeAnalizService);

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
    expect(comp.denemeAnalizs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
