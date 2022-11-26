import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SoruService } from '../service/soru.service';

import { SoruComponent } from './soru.component';

describe('Soru Management Component', () => {
  let comp: SoruComponent;
  let fixture: ComponentFixture<SoruComponent>;
  let service: SoruService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SoruComponent],
    })
      .overrideTemplate(SoruComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SoruComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SoruService);

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
    expect(comp.sorus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
