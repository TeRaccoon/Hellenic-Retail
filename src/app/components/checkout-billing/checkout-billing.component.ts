import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-billing',
  templateUrl: './checkout-billing.component.html',
  styleUrls: ['./checkout-billing.component.scss']
})
export class CheckoutBillingComponent {
  billingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.billingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      companyName: [''],
      streetAddress1: ['', Validators.required],
      streetAddress2: [''],
      town: ['', Validators.required],
      county: ['', Validators.required],
      postcode: ['', Validators.required],
      phone: ['', Validators.required, Validators.minLength(7), Validators.maxLength(14)],
      email: ['', [Validators.required, Validators.email]],
      orderNotes: ['']
    });
  }
}
