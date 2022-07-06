import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { YurtService } from '../service/yurt.service';

import { YurtComponent } from './yurt.component';

describe('Yurt Management Component', () => {
  let comp: YurtComponent;
  let fixture: ComponentFixture<YurtComponent>;
  let service: YurtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [YurtComponent],
    })
      .overrideTemplate(YurtComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(YurtComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(YurtService);

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
    expect(comp.yurts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
