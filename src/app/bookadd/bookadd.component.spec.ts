import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookaddComponent } from './bookadd.component';

describe('BookaddComponent', () => {
  let component: BookaddComponent;
  let fixture: ComponentFixture<BookaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
