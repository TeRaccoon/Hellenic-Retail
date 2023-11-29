import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutBillingComponent } from './checkout-billing.component';

describe('CheckoutBillingComponent', () => {
  let component: CheckoutBillingComponent;
  let fixture: ComponentFixture<CheckoutBillingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutBillingComponent]
    });
    fixture = TestBed.createComponent(CheckoutBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
