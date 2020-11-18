import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookaddcategoryComponent } from './bookaddcategory.component';

describe('BookaddcategoryComponent', () => {
  let component: BookaddcategoryComponent;
  let fixture: ComponentFixture<BookaddcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookaddcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookaddcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
