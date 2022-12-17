import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HocaOlusturComponent } from './hoca-olustur.component';

describe('HocaOlusturComponent', () => {
  let component: HocaOlusturComponent;
  let fixture: ComponentFixture<HocaOlusturComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HocaOlusturComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HocaOlusturComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
