import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryeditComponent } from './subcategoryedit.component';

describe('SubcategoryeditComponent', () => {
  let component: SubcategoryeditComponent;
  let fixture: ComponentFixture<SubcategoryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
