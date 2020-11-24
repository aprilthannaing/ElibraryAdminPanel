import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksupervisorpanelComponent } from './booksupervisorpanel.component';

describe('BooksupervisorpanelComponent', () => {
  let component: BooksupervisorpanelComponent;
  let fixture: ComponentFixture<BooksupervisorpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksupervisorpanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksupervisorpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
