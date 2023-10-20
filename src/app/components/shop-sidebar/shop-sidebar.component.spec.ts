import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSidebarComponent } from './shop-sidebar.component';

describe('ShopSidebarComponent', () => {
  let component: ShopSidebarComponent;
  let fixture: ComponentFixture<ShopSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopSidebarComponent]
    });
    fixture = TestBed.createComponent(ShopSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
