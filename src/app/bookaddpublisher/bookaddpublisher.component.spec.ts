import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookaddpublisherComponent } from './bookaddpublisher.component';

describe('BookaddpublisherComponent', () => {
  let component: BookaddpublisherComponent;
  let fixture: ComponentFixture<BookaddpublisherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookaddpublisherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookaddpublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
