import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  billingForm: FormGroup;
  faCircleExclamation = faCircleExclamation;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.billingForm = this.fb.group({
      "First Name": ['', Validators.required],
      "Last Name": ['', Validators.required],
      "Company Name": [''],
      "Street Address": ['', Validators.required],
      "Street Address 2": [''],
      "Town / City": ['', Validators.required],
      "County": [''],
      "Postcode": ['', Validators.required],
      "Phone": ['', [Validators.required, Validators.minLength(7), Validators.maxLength(14)]],
      "Email address": ['', [Validators.required, Validators.email]],
      "Card Number": ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      "Expiry Date": ['', [Validators.required]],
      "CVC": ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      "orderNotes": [''],
      "action": ['process']
    });
  }

  async formSubmit() {
    if (this.billingForm.valid) {
      const formData = this.billingForm.value;
      const paymentData = this.craftPayload(formData);

      console.log("Payment Data:", paymentData);
      let response = await lastValueFrom(this.dataService.processTransaction(paymentData));
    }
  }

  craftPayload(formData: any) {
    const paymentData = {
      clientReferenceInformation: {
        code: formData['First Name'] + '_' + Math.floor(Math.random() * 1000) // Generate unique code
      },
      paymentInformation: {
        card: {
          number: formData['Card Number'],
          expirationMonth: formData['Expiry Date'].split('/')[0],
          expirationYear: formData['Expiry Date'].split('/')[1]
        }
      },
      orderInformation: {
        amountDetails: {
          totalAmount: "102.21",
          currency: "GBP"
        },
        billTo: {
          firstName: formData['First Name'],
          lastName: formData['Last Name'],
          address1: formData['Street Address'],
          locality: formData['Town / City'],
          administrativeArea: formData['County'],
          postalCode: formData['Postcode'],
          country: "GB",
          email: formData['Email address'],
          phoneNumber: formData['Phone']
        }
      }
    };

    return paymentData
  }
}
