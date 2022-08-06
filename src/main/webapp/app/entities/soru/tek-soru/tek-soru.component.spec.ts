import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TekSoruComponent } from './tek-soru.component';

describe('TekSoruComponent', () => {
  let component: TekSoruComponent;
  let fixture: ComponentFixture<TekSoruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TekSoruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TekSoruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
