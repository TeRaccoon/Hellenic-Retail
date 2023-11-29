import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutOrderSummaryComponent } from './checkout-order-summary.component';

describe('CheckoutOrderSummaryComponent', () => {
  let component: CheckoutOrderSummaryComponent;
  let fixture: ComponentFixture<CheckoutOrderSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutOrderSummaryComponent]
    });
    fixture = TestBed.createComponent(CheckoutOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
