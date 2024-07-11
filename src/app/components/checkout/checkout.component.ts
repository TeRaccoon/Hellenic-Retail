import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleExclamation, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, timestamp } from 'rxjs';
import { CartItem } from 'src/app/common/types/cart';
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
  delivery = 0;
  invoiceTotal = 0;
  processing = false;

  products: any[] = [];
  cart: any[] = [];

  customerId: string | null = null;
  orderReference: string | null = null;

  orderError: string | null = null;

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
    this.authService.isLoggedInObservable().subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.customerId = this.authService.getUserID();
      }
    })

    this.cartService.getUpdateRequest().subscribe((updateRequested: boolean) => {
      if (updateRequested) {
        this.calculateTotal();
      }
    })
    this.tracing();
  }

  async tracing() {
    await lastValueFrom(this.dataService.processPost({'action': 'tracing', 'page': 'checkout', 'customer_id': this.customerId}));
  }

  async calculateTotal() {
    this.cart = this.cartService.getCart();
    let cartProducts: any[] = await this.cartService.getCartItems();
    let subtotal = 0;

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
      this.delivery = 7.50;
    }

    this.netTotal = Number(Number(subtotal).toFixed(2));
    this.vat = Number(Number((subtotal + this.delivery) * 0.2).toFixed(2));
    this.invoiceTotal = Number(Number(this.netTotal + this.vat + this.delivery).toFixed(2));
  }

  async formSubmit() {
    if (this.billingForm.valid) {
      this.processing = true;
      const formData = this.billingForm.value;

      let success = await this.processInvoice(formData);
      
      if (success) {
        await this.processPayment(formData);
      }
      
      this.processing = false;
    }
  }

  async processInvoice(formData: any) {
    let invoiceFormData = await this.createInvoice(formData);
    let response = await lastValueFrom(this.dataService.submitFormData(invoiceFormData));
    if (response.success) {
      return await this.processInvoicedItems(response.id + 1);
    } else {
      this.orderError = 'There was an error processing this order! You have not been charged.';
      this.formService.setPopupMessage('There was an error processing this order!', true, 10000);
      return false;
    }
  }

  async processInvoicedItems(invoice_id: string) {
    for (const item of this.cart) {
      let invoicedItemForm = {
        invoice_id: invoice_id,
        item_id: item.item_id,
        quantity: item.quantity,
        discount: 0,
        table_name: 'invoiced_items',
        action: 'add'
      };

      let response = await lastValueFrom(this.dataService.submitFormData(invoicedItemForm));

      if (!response.success) {
        this.orderError = 'There was an error processing this order! You have not been charged.';
        this.formService.setPopupMessage('There was an error processing this order!', true, 10000);
        return false;
      }
    }
    return true;
  }

  async processPayment(formData: any) {
    const paymentData = this.craftPayload(formData);
    let paymentResponse = await lastValueFrom(this.dataService.processTransaction(paymentData));

    let success = this.validateResponse(paymentResponse);
    if (success) {
      this.sendEmailConfirmation();
      await lastValueFrom(this.dataService.processPost({'action': 'tracing', 'page': 'payment', 'customer_id': this.customerId}));
    } else {
      this.orderError = 'There was an error processing your payment details!';
      this.formService.setPopupMessage('There was an error processing your payment details!', true, 10000);
    }
  }

  async sendEmailConfirmation() {
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
      net_total: '&pound;' + this.netTotal.toFixed(2),
      vat: '&pound;' + this.vat.toFixed(2),
      delivery: '&pound' + this.delivery.toFixed(2),
      total: '&pound;' + this.invoiceTotal.toFixed(2)
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

  async createInvoice(formData: any) {
    this.orderReference = this.customerId !== null ? formData['Last Name'] + '_' + this.customerId + Date.now().toString() : formData['Last Name'] + '_' + Date.now().toString();

    let address_id = await this.checkAddresses(formData);

    const invoiceFormData = {
      title: this.orderReference,
      customer_id: this.customerId,
      status: 'Pending',
      delivery_date: null,
      printed: 'No',
      gross_value: this.netTotal + this.delivery,
      VAT: this.vat,
      total: this.invoiceTotal,
      outstanding_balance: 0,
      delivery_type: formData['Delivery Type'],
      payment_status: 'Yes',
      warehouse_id: null,
      notes: formData['orderNotes'],
      address_id: address_id,
      billing_address_id: address_id,
      postcode: formData['Postcode'],
      table_name: 'invoices',
      action: 'add'
    };

    return invoiceFormData;
  }

  async checkAddresses(formData: any) {
    // TODO
    if (true) { //If the customers address doesn't exist in the database, add it
      const addressFormData = {
        customer_id: this.customerId,
        delivery_address_one: formData['Street Address'],
        delivery_address_two: formData['Street Address 2'],
        delivery_postcode: formData['Postcode'],
        table_name: 'customer_address',
        action: 'add'
      };

      let address_response = await lastValueFrom(this.dataService.submitFormData(addressFormData));
      if (address_response.success) {
        return address_response.id;
      } else {
        this.formService.setPopupMessage('There was an error adding your address!', true, 10000);
        this.orderError = 'There was an error adding your address to the address book!'
        return false;
      }
    } else {
      return true;
    }
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
