import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopluSoruEklemeComponent } from './toplu-soru-ekleme.component';

describe('TopluSoruEklemeComponent', () => {
  let component: TopluSoruEklemeComponent;
  let fixture: ComponentFixture<TopluSoruEklemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopluSoruEklemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopluSoruEklemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
