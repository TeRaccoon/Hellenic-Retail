import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTopProductsComponent } from './home-top-products.component';

describe('HomeTopProductsComponent', () => {
  let component: HomeTopProductsComponent;
  let fixture: ComponentFixture<HomeTopProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTopProductsComponent]
    });
    fixture = TestBed.createComponent(HomeTopProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
