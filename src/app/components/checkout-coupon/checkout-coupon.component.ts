import { Component, EventEmitter, Output } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';
import { Coupon } from 'src/app/common/types/checkout';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout-coupon',
  templateUrl: './checkout-coupon.component.html',
  styleUrls: ['./checkout-coupon.component.scss'],
})
export class CheckoutCouponComponent {
  @Output() couponEvent = new EventEmitter<Coupon>();

  faInfoCircle = faInfoCircle;
  shown = false;
  coupon: string = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private formService: FormService
  ) {}

  async applyCoupon() {
    if (this.coupon != '') {
      let response = await this.dataService.processPost({
        action: 'coupon',
        code: this.coupon,
      });

      this.processCoupon(response);
    }
  }

  processCoupon(coupon: Coupon) {
    if (
      coupon.name != null &&
      this.isInDate(coupon.offer_start, coupon.offer_end) &&
      this.appliesToCustomer(coupon.customer_id) &&
      this.isWithinQuantityLimit(coupon.quantity_limit)
    ) {
      this.couponEvent.emit(coupon);
      this.formService.setPopupMessage(
        'Code applied successfully!',
        true,
        5000
      );
      this.shown = false;
    } else {
      this.formService.setPopupMessage(
        'Whoops! This code is not valid!',
        true,
        5000
      );
    }
  }

  isInDate(startDate: Date | null, endDate: Date | null) {
    if (startDate == null && endDate == null) {
      return true;
    }

    if (startDate == null && endDate != null && endDate > new Date()) {
      return true;
    }

    if (
      startDate != null &&
      new Date() > startDate &&
      endDate != null &&
      endDate > new Date()
    ) {
      return true;
    }

    return false;
  }

  appliesToCustomer(customer_id: number | null) {
    if (customer_id == null) {
      return true;
    }

    if (Number(this.authService.getCustomerID()) === customer_id) {
      return true;
    }

    return false;
  }

  isWithinQuantityLimit(quantityLimit: number | null) {
    return quantityLimit == null || quantityLimit > 0;
  }
}
