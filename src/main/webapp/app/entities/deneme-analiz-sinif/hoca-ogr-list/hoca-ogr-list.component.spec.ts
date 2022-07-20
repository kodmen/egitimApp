import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HocaOgrListComponent } from './hoca-ogr-list.component';

describe('HocaOgrListComponent', () => {
  let component: HocaOgrListComponent;
  let fixture: ComponentFixture<HocaOgrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HocaOgrListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HocaOgrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
