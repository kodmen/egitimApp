import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMesajOlusturComponent } from './user-mesaj-olustur.component';

describe('UserMesajOlusturComponent', () => {
  let component: UserMesajOlusturComponent;
  let fixture: ComponentFixture<UserMesajOlusturComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMesajOlusturComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMesajOlusturComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
