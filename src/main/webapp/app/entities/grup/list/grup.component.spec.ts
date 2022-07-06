import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GrupService } from '../service/grup.service';

import { GrupComponent } from './grup.component';

describe('Grup Management Component', () => {
  let comp: GrupComponent;
  let fixture: ComponentFixture<GrupComponent>;
  let service: GrupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GrupComponent],
    })
      .overrideTemplate(GrupComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GrupService);

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
    expect(comp.grups?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
