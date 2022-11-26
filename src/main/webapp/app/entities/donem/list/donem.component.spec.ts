import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DonemService } from '../service/donem.service';

import { DonemComponent } from './donem.component';

describe('Donem Management Component', () => {
  let comp: DonemComponent;
  let fixture: ComponentFixture<DonemComponent>;
  let service: DonemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DonemComponent],
    })
      .overrideTemplate(DonemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DonemService);

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
    expect(comp.donems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
