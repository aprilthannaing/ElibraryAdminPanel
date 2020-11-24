import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishereditComponent } from './publisheredit.component';

describe('PublishereditComponent', () => {
  let component: PublishereditComponent;
  let fixture: ComponentFixture<PublishereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishereditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
