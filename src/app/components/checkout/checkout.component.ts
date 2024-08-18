import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleExclamation, faCircleNotch, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { MailService } from 'src/app/services/mail.service';
import { UrlService } from 'src/app/services/url.service'
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutSummary, PaymentMethod } from '../../common/types/checkout';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';
import { CartItem, CartProduct } from 'src/app/common/types/cart';
import { Response } from '../../common/types/data-response'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  public paypalConfig ? : IPayPalConfig;

  billingForm: FormGroup;

  faCircleExclamation = faCircleExclamation;
  faCircleNotch = faCircleNotch;
  book = faAddressBook;

  processing = false;

  checkoutSummary: CheckoutSummary;

  cartProducts: CartProduct[] = [];
  cart: CartItem[] = [];

  userType: string | null = null;

  customerId: string | null = null;
  orderReference: string | null = null;

  orderError: string | null = null;

  addressBookVisible = false;
  addressBook: any[] = [];

  payerDetails: any = {};
  paymentMethod = PaymentMethod.Barclays;

  constructor(private urlService: UrlService, private router: Router, private authService: AuthService, private cartService: CartService, private fb: FormBuilder, private dataService: DataService, private formService: FormService, private checkoutService: CheckoutService, private mailService: MailService) {
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

    this.checkoutSummary = this.checkoutService.getCheckoutSummary();
  }

  ngOnInit() {
    this.load();
    this.initConfig();
  }
  
  private initConfig(): void {
    this.paypalConfig = {
      currency: 'GBP',
      clientId: 'sb',
      createOrderOnClient: (data) => this.createOrder(),
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          this.payerDetails = details;
        });
        console.log(data);
      },
      onClientAuthorization: (data) => {
        
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

  private createOrder(): ICreateOrderRequest {
    return {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'GBP',
          value: this.checkoutSummary.total.toString(),
          breakdown: {
            item_total: {
              currency_code: 'GBP',
              value: this.checkoutSummary.total.toString(),
            }
          }
        },
        items: [{
          name: 'Total Amount',
          quantity: '1',
          category: 'DIGITAL_GOODS',
          unit_amount: {
            currency_code: 'GBP',
            value: this.checkoutSummary.total.toString()
          }
        }]
      }]
    };
  }

  async load() {
    this.authService.isLoggedInObservable().subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.customerId = this.authService.getUserID();
        this.userType = this.authService.getUserType();
        this.loadAddressBook();
      }
    })

    this.cartService.getUpdateRequest().subscribe((updateRequested: boolean) => {
      if (updateRequested) {
        this.calculateTotal();
      }
    })
    this.tracing();
  }

  async loadAddressBook() {
    this.addressBook = await this.dataService.processPost({'action': 'address-book', 'customer_id': this.customerId?.toString()}, true);
  }

  async tracing() {
    await this.dataService.processPost({'action': 'tracing', 'page': 'checkout', 'customer_id': this.customerId});
  }

  async calculateTotal() {
    this.cart = await this.cartService.getCart(true);
    this.cartProducts = await this.cartService.getCartItems();
    let subtotal = this.cartService.getCartTotal();

    let delivery = subtotal < 30 ? 7.50 : 0;
    // let vat = Number(Number((subtotal + delivery) * 0.2).toFixed(2)); This is VAT added onto the product prices which may already have VAT
    let vat = (subtotal * 0.2) / (1 + 0.2);  //This is VAT taken from the products

    const updatedSummary = {
      delivery: delivery,
      subtotal: subtotal,
      vat: vat,
      total: Number(Number(subtotal + delivery).toFixed(2))
    };
    this.checkoutService.updateCheckoutSummary(updatedSummary);
    
    this.checkoutSummary = this.checkoutService.getCheckoutSummary();
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
  
  async paypalSubmit() {
    (window as any).paypal.Buttons(this.paypalConfig).render('#paypal-button-container');
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
        unit: item.unit,
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

  async processPayment(formData: any, withTransaction = true) {
    let success = true;
    if (withTransaction) {
      const paymentData = this.craftPayload(formData);
      let paymentResponse = await this.dataService.processTransaction(paymentData);
  
      success = this.validateResponse(paymentResponse);
    }

    if (success) {
      await this.cartService.clearCart(false);

      let response = await this.sendEmailConfirmation();
      if (response.success) {
        setTimeout(() => {
          this.router.navigate(['/order-complete']);
        }, 3000);
      } else {
        this.orderError = 'There was an error sending your email confirmation!';
      }
      await this.dataService.processPost({'action': 'tracing', 'page': 'payment', 'customer_id': this.customerId});
    } else {
      this.orderError = 'There was an error processing your payment details!';
      this.formService.setPopupMessage('There was an error processing your payment details!', true, 10000);
    }
  }

  sendEmailConfirmation(): Promise<Response> {
    let products = this.cartProducts.map((product: CartProduct, index) => {
      return {
        name: product.name,
        quantity: this.cart[index].quantity,
        price: '&pound;' + Number(product.discounted_price).toFixed(2),
      };
    });

    const formData = this.billingForm.value;
    const emailInformation = {
      reference: this.orderReference,
      products: products,
      net_total: '&pound;' + (this.checkoutSummary.subtotal - this.checkoutSummary.vat).toFixed(2),
      vat: '&pound;' + this.checkoutSummary.vat.toFixed(2),
      delivery: '&pound' + this.checkoutSummary.delivery.toFixed(2),
      total: '&pound;' + this.checkoutSummary.total.toFixed(2)
    };

    const emailHTML = this.mailService.generateOrderConfirmationEmail(emailInformation);

    const emailData = {
      action: 'mail',
      mail_type: 'order',
      subject: 'Thank you for your order!',
      email_HTML: emailHTML,
      address: formData['Email Address'],
      name: `${formData['First Name']} -  ${formData['Last Name']}`,
    };

    return this.mailService.sendEmail(emailData);
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
      gross_value: this.checkoutSummary.subtotal + this.checkoutSummary.delivery,
      VAT: this.checkoutSummary.vat,
      total: this.checkoutSummary.total,
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
        total: this.checkoutSummary.total,
      });
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
          totalAmount: this.checkoutSummary.total,
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

  toggleAddressBook() {
    if (this.addressBook.length === 0) {
      this.formService.setPopupMessage('You have no addresses in your address book!', true, 3000);
    } else {
      this.addressBookVisible = !this.addressBookVisible;
    }
  }

  selectAddress(address: any) {
    this.billingForm.get('Street Address')?.setValue(address.delivery_address_one);
    this.billingForm.get('Street Address 2')?.setValue(address.delivery_address_two);
    this.billingForm.get('Town / City')?.setValue(address.delivery_address_three);
    this.billingForm.get('Postcode')?.setValue(address.delivery_postcode);
    this.addressBookVisible = false;
  }

  switchPaymentMethods() {
    this.paymentMethod = this.paymentMethod == PaymentMethod.Barclays ? PaymentMethod.PayPal : PaymentMethod.Barclays;
  }

  get PaymentMethod() {
    return PaymentMethod;
  }
}
