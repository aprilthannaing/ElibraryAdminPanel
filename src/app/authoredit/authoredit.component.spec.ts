import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoreditComponent } from './authoredit.component';

describe('AuthoreditComponent', () => {
  let component: AuthoreditComponent;
  let fixture: ComponentFixture<AuthoreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthoreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthoreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
