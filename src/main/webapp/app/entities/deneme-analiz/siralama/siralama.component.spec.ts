import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiralamaComponent } from './siralama.component';

describe('SiralamaComponent', () => {
  let component: SiralamaComponent;
  let fixture: ComponentFixture<SiralamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiralamaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiralamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
