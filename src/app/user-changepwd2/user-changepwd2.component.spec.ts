import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangepwd2Component } from './user-changepwd2.component';

describe('UserChangepwd2Component', () => {
  let component: UserChangepwd2Component;
  let fixture: ComponentFixture<UserChangepwd2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChangepwd2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangepwd2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
