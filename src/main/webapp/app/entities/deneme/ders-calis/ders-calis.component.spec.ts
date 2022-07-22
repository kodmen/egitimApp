import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DersCalisComponent } from './ders-calis.component';

describe('DersCalisComponent', () => {
  let component: DersCalisComponent;
  let fixture: ComponentFixture<DersCalisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DersCalisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DersCalisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
