import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-checkout-coupon',
  templateUrl: './checkout-coupon.component.html',
  styleUrls: ['./checkout-coupon.component.scss']
})
export class CheckoutCouponComponent {
  couponForm: FormGroup;
  faInfoCircle = faInfoCircle;
  shown = false;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      "code": ['', Validators.required]
    });
  }

  formSubmit() {
    if (this.couponForm.valid) {
      const formData = this.couponForm.value;
      this.dataService.submitFormData('coupon', formData).subscribe((data: any) => {
        if (data != null) {
          console.log("Coupon valid");
        } else {
          console.log("Coupon invalid");
        }
      })
    }
  }
}
