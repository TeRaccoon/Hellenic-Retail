import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCategorySearchComponent } from './navbar-category-search.component';

describe('NavbarCategorySearchComponent', () => {
  let component: NavbarCategorySearchComponent;
  let fixture: ComponentFixture<NavbarCategorySearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarCategorySearchComponent]
    });
    fixture = TestBed.createComponent(NavbarCategorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
