import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCouponComponent } from './checkout-coupon.component';

describe('CheckoutCouponComponent', () => {
  let component: CheckoutCouponComponent;
  let fixture: ComponentFixture<CheckoutCouponComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutCouponComponent]
    });
    fixture = TestBed.createComponent(CheckoutCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
