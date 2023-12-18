import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  billingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.billingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      companyName: [''],
      streetAddress1: ['', Validators.required],
      streetAddress2: [''],
      town: ['', Validators.required],
      county: [''],
      postcode: ['', Validators.required],
      phone: ['', Validators.required, Validators.minLength(7), Validators.maxLength(14)],
      email: ['', [Validators.required, Validators.email]],
      orderNotes: ['']
    });
  }

  formSubmit() {
    if (this.billingForm.valid) {
      const formData = this.billingForm.value;
      console.log(formData)
    }
  }
}
