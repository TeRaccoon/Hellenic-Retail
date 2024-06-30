import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCompleteComponent } from './order-complete.component';

describe('OrderCompleteComponent', () => {
  let component: OrderCompleteComponent;
  let fixture: ComponentFixture<OrderCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderCompleteComponent]
    });
    fixture = TestBed.createComponent(OrderCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
