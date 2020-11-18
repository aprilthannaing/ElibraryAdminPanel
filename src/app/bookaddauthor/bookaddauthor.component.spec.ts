import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookaddauthorComponent } from './bookaddauthor.component';

describe('BookaddauthorComponent', () => {
  let component: BookaddauthorComponent;
  let fixture: ComponentFixture<BookaddauthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookaddauthorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookaddauthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
