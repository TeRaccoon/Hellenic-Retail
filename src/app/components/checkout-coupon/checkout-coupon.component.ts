import { Component } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout-coupon',
  templateUrl: './checkout-coupon.component.html',
  styleUrls: ['./checkout-coupon.component.scss']
})
export class CheckoutCouponComponent {
  faInfoCircle = faInfoCircle;
  shown = false;
}
