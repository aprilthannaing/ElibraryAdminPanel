import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterDemoComponent } from './search-filter-demo.component';

describe('SearchFilterDemoComponent', () => {
  let component: SearchFilterDemoComponent;
  let fixture: ComponentFixture<SearchFilterDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFilterDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
