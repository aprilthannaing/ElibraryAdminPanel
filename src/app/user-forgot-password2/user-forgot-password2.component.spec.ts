import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserForgotPassword2Component } from './user-forgot-password2.component';

describe('UserForgotPassword2Component', () => {
  let component: UserForgotPassword2Component;
  let fixture: ComponentFixture<UserForgotPassword2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserForgotPassword2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserForgotPassword2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
