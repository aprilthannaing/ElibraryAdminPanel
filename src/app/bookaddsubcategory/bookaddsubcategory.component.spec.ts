import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookaddsubcategoryComponent } from './bookaddsubcategory.component';

describe('BookaddsubcategoryComponent', () => {
  let component: BookaddsubcategoryComponent;
  let fixture: ComponentFixture<BookaddsubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookaddsubcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookaddsubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
