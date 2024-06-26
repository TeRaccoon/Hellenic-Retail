import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleExclamation, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  billingForm: FormGroup;

  faCircleExclamation = faCircleExclamation;
  faCircleNotch = faCircleNotch;

  netTotal = 0;
  vat = 0;
  invoiceTotal = 0;
  processing = false;

  products: any[] = [];
  cart: any[] = [];

  customerId: string | null = null;
  orderReference: string | null = null;

  constructor(private router: Router, private authService: AuthService, private cartService: CartService, private fb: FormBuilder, private dataService: DataService, private formService: FormService) {
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
      "Email Address": ['', [Validators.required, Validators.email]],
      "Card Number": ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      "Expiry Month": ['', [Validators.required]],
      "Expiry Year": ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      "CVC": ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      "orderNotes": [''],
      "action": ['process']
    });
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    await this.authService.checkLogin()
    this.customerId = this.authService.getUserID();
    this.calculateTotal();
  }

  async calculateTotal() {
    let cartIDs = this.cartService.getIDs();
    this.cart = this.cartService.getCartItems();

    let cartProducts: any[] = [];
    let subtotal = 0;
    await Promise.all(cartIDs.map(async(id) => {
      if (id !== null) {
        cartProducts.push(await lastValueFrom(this.dataService.collectData('product-from-id', id.toString())));
      }
    }));

    cartProducts.forEach((product, index) => {
      if (this.cart[index] && product != null) {
        let individualPrice = product.retail_price;
        let discountedPrice = individualPrice;
        if (product.discount != null || product.discount != 0) {
          discountedPrice = individualPrice * ((100 - product.discount) / 100);
        }

        product.total = individualPrice * this.cart[index].quantity;
        product.discounted_total = discountedPrice * this.cart[index].quantity;

        subtotal += product.discounted_total;
      }
    });

    this.products = cartProducts;

    if (subtotal < 30) {
      subtotal += 7.50;
    }

    this.netTotal = Number(Number(subtotal).toFixed(2));
    this.vat = Number(Number(subtotal * 0.2).toFixed(2));
    this.invoiceTotal = Number(Number(this.netTotal + this.vat).toFixed(2));
  }

  async formSubmit() {
    if (this.billingForm.valid) {
      this.processing = true;
      const formData = this.billingForm.value;
      const paymentData = this.craftPayload(formData);

      let response = await lastValueFrom(this.dataService.processTransaction(paymentData));

      let success = this.validateResponse(response);
      if (success) {
        let invoiceFormData = this.createInvoice(formData);
        response = await this.processInvoice(invoiceFormData);
        if (response.success) {
          this.sendEmailConfirmation(invoiceFormData);
        }
      }
      this.processing = false;
    }
  }

  async sendEmailConfirmation(invoiceFormData: any) {
    let products = this.products.map((product: any, index) => {
      return {
        name: product.name,
        quantity: this.cart[index].quantity,
        price: '&pound;' + Number(product.discounted_total).toFixed(2),
      };
    });

    const emailInformation = {
      reference: this.orderReference,
      products: products,
      net_total: '&pound;' + this.netTotal,
      vat: '&pound;' + this.vat,
      total: '&pound;' + this.invoiceTotal
    };

    const emailHTML = this.dataService.generateOrderConfirmationEmail(emailInformation);

    const emailData = {
      action: 'mail',
      mail_type: 'order',
      subject: 'Thank you for your order!',
      email_HTML: emailHTML
    };

    return await lastValueFrom(this.dataService.sendEmail(emailData));
  }

  async processInvoice(invoiceFormData: any) {
    let response = await lastValueFrom(this.dataService.submitFormData(invoiceFormData));
    return response;
  }

  createInvoice(formData: any) {
    const invoiceFormData = {
      title: this.orderReference,
      customer_id: this.customerId,
      status: 'Pending',
      delivery_date: null,
      printed: 'No',
      net_value: this.netTotal,
      vat: this.vat,
      total: this.invoiceTotal,
      delivery_type: formData['Delivery Type'],
      payment_status: 'Yes',
      warehouse_id: null,
      notes: formData['orderNotes'],
      address_line_1: formData['Street Address'],
      address_line_2: formData['Street Address 2'],
      address_line_3: null,
      postcode: formData['Postcode'],
      address_id: null,
      table_name: 'invoices',
      action: 'add'
    };

    return invoiceFormData;
  }

  validateResponse(response: any) {
    if (response.status_code >= 200 && response.status_code <= 299) {
      this.formService.setPopupMessage("Payment Successful!");
      this.formService.showPopup();
      this.formService.setOrderDetails({
        reference: this.orderReference,
        total: this.invoiceTotal,
      });
      setTimeout(() => {
        this.router.navigate(['/order-complete']);
      }, 3000);
      return true;
    } else {
      this.formService.setPopupMessage("There was an error processing your payment!");
      this.formService.showPopup();
      return false;
    }
  }

  craftPayload(formData: any) {
    this.orderReference = this.customerId !== null ? formData['Last Name'] + '_' + this.customerId : formData['Last Name'] + '_' + Date.now();
    const paymentData = {
      clientReferenceInformation: {
        code: this.orderReference
      },
      processingInformation: {
        capture: true,
      },
      paymentInformation: {
        card: {
          number: formData['Card Number'],
          expirationMonth: formData['Expiry Month'],
          expirationYear: formData['Expiry Year'],
          securityCode: formData['CVC']
        }
      },
      orderInformation: {
        amountDetails: {
          totalAmount: this.invoiceTotal,
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
          email: formData['Email Address'],
          phoneNumber: formData['Phone']
        }
      }
    };
  
    const paymentDataString = JSON.stringify(paymentData, null, 2);
  
    return paymentDataString;
  }
}
