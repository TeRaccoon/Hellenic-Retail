import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCategoryRowComponent } from './home-category-row.component';

describe('HomeCategoryRowComponent', () => {
  let component: HomeCategoryRowComponent;
  let fixture: ComponentFixture<HomeCategoryRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeCategoryRowComponent]
    });
    fixture = TestBed.createComponent(HomeCategoryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
