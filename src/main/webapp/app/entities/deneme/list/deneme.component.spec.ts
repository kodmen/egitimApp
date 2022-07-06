import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DenemeService } from '../service/deneme.service';

import { DenemeComponent } from './deneme.component';

describe('Deneme Management Component', () => {
  let comp: DenemeComponent;
  let fixture: ComponentFixture<DenemeComponent>;
  let service: DenemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DenemeComponent],
    })
      .overrideTemplate(DenemeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DenemeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DenemeService);

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
    expect(comp.denemes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
