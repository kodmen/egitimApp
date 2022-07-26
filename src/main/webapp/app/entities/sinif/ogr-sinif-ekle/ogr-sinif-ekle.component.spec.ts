import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgrSinifEkleComponent } from './ogr-sinif-ekle.component';

describe('OgrSinifEkleComponent', () => {
  let component: OgrSinifEkleComponent;
  let fixture: ComponentFixture<OgrSinifEkleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OgrSinifEkleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OgrSinifEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
