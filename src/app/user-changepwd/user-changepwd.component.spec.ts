import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangepwdComponent } from './user-changepwd.component';

describe('UserChangepwdComponent', () => {
  let component: UserChangepwdComponent;
  let fixture: ComponentFixture<UserChangepwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChangepwdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangepwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
