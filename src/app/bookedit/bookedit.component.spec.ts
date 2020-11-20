import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookeditComponent } from './bookedit.component';

describe('BookeditComponent', () => {
  let component: BookeditComponent;
  let fixture: ComponentFixture<BookeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
