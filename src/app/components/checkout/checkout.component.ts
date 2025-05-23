import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faAddressBook,
  faCircleExclamation,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { lastValueFrom, Subscription } from 'rxjs';
import {
  ConstManager,
  dataKeys,
  settingKeys,
} from 'src/app/common/const/const-manager';
import {
  AccountResponse,
  CustomerDetails,
  RegistrationForm,
} from 'src/app/common/types/account';
import { CartItem, CartProduct } from 'src/app/common/types/cart';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { MailService } from 'src/app/services/mail.service';
import {
  CheckoutFormFull,
  CheckoutSummary,
  CheckoutType,
  Coupon,
  CouponType,
  Discount,
  PaymentMethod,
  YesNo,
} from '../../common/types/checkout';
import { Response } from '../../common/types/data-response';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  private readonly subscriptions = new Subscription();

  public paypalConfig?: IPayPalConfig;

  billingForm: FormGroup;

  faCircleExclamation = faCircleExclamation;
  faCircleNotch = faCircleNotch;
  book = faAddressBook;

  processing = false;
  submitted = false;

  shouldCreateAccount = true;
  terms = false;
  saveAddress = false;

  checkoutSummary: CheckoutSummary;

  checkoutType: CheckoutType = CheckoutType.Cart;
  cartProducts: CartProduct[] = [];
  cart: CartItem[] = [];

  userType: string = 'Retail';

  coupon: Coupon | null = null;

  customerId: string | null = null;
  orderReference: string | null = null;

  orderError: string | null = null;
  fieldError: string | null = null;

  addressBookVisible = false;
  addressBook: any[] = [];
  customerDetails: CustomerDetails | null = null;

  payerDetails: any = {};
  paymentMethod = PaymentMethod.Barclays;
  supportEmail;

  invoiceId: number | null = null;
  invoicedItemIDs: number[] = [];
  originalSubtotal: number | null = null;

  freeDeliveryMinimum = 30;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private cartService: CartService,
    private fb: FormBuilder,
    private dataService: DataService,
    private formService: FormService,
    private checkoutService: CheckoutService,
    private mailService: MailService,
    private router: Router,
    private consts: ConstManager
  ) {
    this.billingForm = this.fb.group({
      'First Name': ['', Validators.required],
      'Last Name': ['', Validators.required],
      'Company Name': [''],
      'Street Address': ['', Validators.required],
      'Street Address 2': [''],
      'Town / City': ['', Validators.required],
      County: [''],
      Postcode: ['', Validators.required],
      Phone: [
        '',
        [
          Validators.minLength(7),
          Validators.maxLength(14),
          Validators.pattern(/^\d*$/),
        ],
      ],
      'Email Address': ['', [Validators.required, Validators.email]],
      'Card Number': [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      'Expiry Month': [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      'Expiry Year': [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      CVC: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      orderNotes: [''],
      action: ['process'],
    });

    this.checkoutSummary = this.checkoutService.getCheckoutSummary();
    this.supportEmail = this.consts.getConstant(settingKeys.support_email);
    this.freeDeliveryMinimum = this.consts.getConstant(
      settingKeys.free_delivery_minimum
    );
    this.invoicedItemIDs = [];
  }

  ngOnInit() {
    this.load();
    this.initConfig();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initConfig(): void {
    this.paypalConfig = {
      currency: 'GBP',
      clientId: 'sb',
      createOrderOnClient: (data) => this.createOrder(),
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          this.payerDetails = details;
        });
        console.log(data);
      },
      onClientAuthorization: (data) => {},
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  private createOrder(): ICreateOrderRequest {
    return {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'GBP',
            value: this.checkoutSummary.total.toString(),
            breakdown: {
              item_total: {
                currency_code: 'GBP',
                value: this.checkoutSummary.total.toString(),
              },
            },
          },
          items: [
            {
              name: 'Total Amount',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'GBP',
                value: this.checkoutSummary.total.toString(),
              },
            },
          ],
        },
      ],
    };
  }

  async load() {
    this.subscriptions.add(
      this.authService.isLoggedInObservable().subscribe((loggedIn: boolean) => {
        if (loggedIn) {
          this.initializeCustomerData();
        }
      })
    );

    this.cartService
      .getUpdateRequest()
      .subscribe((updateRequested: boolean) => {
        if (updateRequested) {
          this.calculateTotal();
        }
      });

    this.tracing();
  }

  initializeCustomerData() {
    this.customerId = this.authService.getCustomerID();
    this.shouldCreateAccount = this.customerId == null;
    this.userType = this.authService.getCustomerType() ?? 'Retail';
    this.loadCustomerDetails();
    this.loadAddressBook();
  }

  async loadCustomerDetails() {
    this.customerDetails = await this.dataService.processPost({
      action: 'account-details',
      customer_id: this.customerId?.toString(),
    });

    this.billingForm
      .get('First Name')
      ?.setValue(this.customerDetails?.forename);
    this.billingForm.get('Last Name')?.setValue(this.customerDetails?.surname);
    this.billingForm
      .get('Email Address')
      ?.setValue(this.customerDetails?.email);
    this.billingForm
      .get('Phone')
      ?.setValue(this.customerDetails?.phone_number_primary);
  }

  async loadAddressBook() {
    this.addressBook = await this.dataService.processPost(
      { action: 'address-book', customer_id: this.customerId?.toString() },
      true
    );

    if (this.addressBook.length > 0) {
      this.selectAddress(this.addressBook[this.addressBook.length - 1]);
    }
  }

  async tracing() {
    await this.dataService.processPost({
      action: 'tracing',
      page: 'checkout',
      customer_id: this.customerId,
    });
  }

  async calculateTotal(coupon: Coupon | null = null) {
    this.checkoutType = this.cartService.getCheckoutType();

    if (this.checkoutType == CheckoutType.BuyNow) {
      this.cart = this.cartService.getBuyNowProduct();
      this.cartProducts = await this.cartService.getBuyNowAsCartProduct();
    } else {
      this.cart = await this.cartService.getCart(true);
      this.cartProducts = await this.cartService.getCartItems();
    }

    let subtotal = this.cartService.getCartTotal();
    let total = subtotal;
    let discount: Discount | null = null;

    if (coupon != null && coupon.amount) {
      if (coupon.type == CouponType.Percentage) {
        total = (subtotal * (100 - coupon.amount)) / 100;
      } else {
        subtotal -= coupon.amount;
      }

      discount = {
        title: `Savings (${coupon.name})`,
        value: total - subtotal,
      };
    }

    let deliveryMinimum = await this.consts.getConstant(
      settingKeys.free_delivery_minimum
    );

    let deliveryCost = await this.consts.getConstant(dataKeys.delivery_cost);

    let delivery = subtotal < deliveryMinimum ? deliveryCost : 0;
    // let vat = Number(Number((subtotal + delivery) * 0.2).toFixed(2)); This is VAT added onto the product prices which may already have VAT
    let vat = (subtotal * 0.2) / (1 + 0.2); //This is VAT taken from the products

    const updatedSummary = {
      delivery: delivery,
      subtotal: subtotal,
      vat: vat,
      total: Number(Number(total + delivery).toFixed(2)),
      discount: discount,
    };

    this.checkoutService.updateCheckoutSummary(updatedSummary);
    this.checkoutSummary = this.checkoutService.getCheckoutSummary();
  }

  async formSubmit() {
    this.processing = true;
    this.submitted = true;

    if (!this.billingForm.valid) {
      this.fieldError = 'Please address all incorrect fields!';
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      this.processing = false;

      return;
    }

    const formData: CheckoutFormFull = this.billingForm.value;

    let response = await this.createAccount(formData);
    if (!response.success) {
      this.fieldError = response.message;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this.processing = false;
      return;
    }
    if (response.data) {
      this.customerId = response.data;
    }

    let success = await this.processInvoice(formData);

    if (success) {
      if (this.coupon != null) {
        success = await this.applyInvoiceDiscount(formData);
      }
      await this.processPayment(formData);
    }

    this.processing = false;
  }

  async applyInvoiceDiscount(formData: CheckoutFormFull) {
    let form: any = await this.createInvoice(formData);
    form.action = 'append';
    form.id = this.invoiceId;

    return await lastValueFrom(this.dataService.submitFormData(form));
  }

  async createAccount(formData: any): Promise<AccountResponse> {
    if (this.shouldCreateAccount && this.customerId == null) {
      const registrationFormData: RegistrationForm = {
        action: 'create-account',
        email: formData['Email Address'],
        forename: formData['First Name'],
        surname: formData['Last Name'],
        promoConsent: false,
        businessRequest: false,
        termsAndConditions: this.terms,
        pending_approval: YesNo.No,
        table_name: 'customers',
      };

      let response = await this.accountService.createAccount(
        registrationFormData,
        true,
        true
      );

      return response;
    }

    return { success: true, message: '' };
  }

  async paypalSubmit() {
    (window as any).paypal
      .Buttons(this.paypalConfig)
      .render('#paypal-button-container');
  }

  async processInvoice(formData: any) {
    let invoiceFormData = await this.createInvoice(formData);
    let response = await lastValueFrom(
      this.dataService.submitFormData(invoiceFormData)
    );
    if (response.success) {
      return await this.processInvoicedItems(response.id);
    } else {
      this.orderError =
        'There was an error processing this order! You have not been charged.';
      this.formService.setPopupMessage(
        'There was an error processing this order!',
        true,
        10000
      );
      return false;
    }
  }

  async processInvoicedItems(invoiceId: string) {
    this.invoiceId = Number(invoiceId);
    for (const item of this.cart) {
      let invoicedItemForm = {
        invoice_id: invoiceId,
        item_id: item.item_id,
        quantity: item.quantity,
        discount: 0,
        unit: item.unit,
        table_name: 'invoiced_items',
        action: 'add',
      };

      let response = await lastValueFrom(
        this.dataService.submitFormData(invoicedItemForm)
      );

      if (!this.handleInvoicedItemResponse(response)) return;
    }

    if (this.checkoutSummary.subtotal < this.freeDeliveryMinimum) {
      let deliveryItemId = this.consts.getConstant(dataKeys.delivery_item);

      let invoicedItemForm = {
        invoice_id: invoiceId,
        item_id: deliveryItemId,
        quantity: 1,
        discount: 0,
        unit: 'Unit',
        table_name: 'invoiced_items',
        action: 'add',
      };

      let response = await lastValueFrom(
        this.dataService.submitFormData(invoicedItemForm)
      );

      if (!this.handleInvoicedItemResponse(response)) return;
    }

    return true;
  }

  handleInvoicedItemResponse(response: any) {
    if (!response.success) {
      this.orderError =
        'There was an error processing this order! You have not been charged.';
      this.formService.setPopupMessage(
        'There was an error processing this order!',
        true,
        10000
      );
      return false;
    }

    this.invoicedItemIDs.push(response.id);

    return true;
  }

  async processPayment(formData: any, withTransaction = true) {
    let success = true;
    if (withTransaction) {
      const paymentData = this.craftPayload(formData);
      let paymentResponse = await this.dataService.processTransaction(
        paymentData
      );

      success = this.validateResponse(paymentResponse);
    }

    if (success) {
      let response = await this.sendEmailConfirmation();

      if (this.checkoutType == CheckoutType.Cart) {
        await this.cartService.clearCart(false);
      }

      if (response.success) {
        if (this.coupon?.quantity_limit) {
          await this.dataService.processPost({
            action: 'coupon-use',
            coupon_id: this.coupon.id,
            new_quantity_limit: this.coupon.quantity_limit - 1,
          });
        }
        setTimeout(() => {
          this.router.navigate(['/order-complete']);
        }, 3000);
      } else {
        this.orderError = 'There was an error sending your email confirmation!';
      }
      await this.dataService.processPost({
        action: 'tracing',
        page: 'payment',
        customer_id: this.customerId,
      });
    } else {
      this.orderError = 'There was an error processing your payment details!';
      this.formService.setPopupMessage(
        'There was an error processing your payment details!',
        true,
        10000
      );

      await this.checkoutService.revertInvoice(
        this.invoicedItemIDs,
        this.invoiceId!
      );
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
      net_total:
        '&pound;' +
        (this.checkoutSummary.subtotal - this.checkoutSummary.vat).toFixed(2),
      vat: '&pound;' + this.checkoutSummary.vat.toFixed(2),
      delivery: '&pound;' + this.checkoutSummary.delivery.toFixed(2),
      discount_value:
        '&pound;' +
        Math.abs(this.checkoutSummary.discount?.value ?? 0).toFixed(2),
      total: '&pound;' + this.checkoutSummary.total.toFixed(2),
    };

    const emailHTML =
      this.mailService.generateOrderConfirmationEmail(emailInformation);

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
    this.orderReference =
      this.customerId !== null
        ? formData['Last Name'] + '_' + this.customerId + Date.now().toString()
        : formData['Last Name'] + '_' + Date.now().toString();

    let address_id = await this.checkAddresses(formData);
    const invoiceFormData = {
      title: this.orderReference,
      customer_id: this.customerId,
      status: 'Pending',
      delivery_date: null,
      printed: 'No',
      gross_value: Number(this.checkoutSummary.subtotal).toFixed(2),
      VAT: Number(this.checkoutSummary.vat).toFixed(2),
      total: Number(this.checkoutSummary.total).toFixed(2),
      discount_value: Number(
        Math.abs(this.checkoutSummary.discount?.value ?? 0)
      ).toFixed(2),
      outstanding_balance: 0,
      delivery_type: 'Delivery',
      payment_status: 'Yes',
      warehouse_id: null,
      notes: formData['orderNotes'],
      address_id: address_id,
      billing_address_id: address_id,
      postcode: formData['Postcode'],
      type: this.userType,
      table_name: 'invoices',
      action: 'add',
    };

    return invoiceFormData;
  }

  async checkAddresses(formData: any) {
    if (this.saveAddress) {
      const addressFormData = {
        customer_id: this.customerId,
        delivery_address_one: formData['Street Address'],
        delivery_address_two: formData['Street Address 2'],
        delivery_address_three: formData['Town / City'],
        delivery_postcode: formData['Postcode'],
        table_name: 'customer_address',
        action: 'add',
      };

      let address_response = await lastValueFrom(
        this.dataService.submitFormData(addressFormData)
      );
      if (address_response.success) {
        return address_response.id;
      } else {
        this.formService.setPopupMessage(
          'There was an error adding your address!',
          true,
          10000
        );
        this.orderError =
          'There was an error adding your address to the address book!';
        return false;
      }
    } else {
      return true;
    }
  }

  validateResponse(response: any) {
    if (response.status_code >= 200 && response.status_code <= 299) {
      this.formService.setPopupMessage('Payment Successful!');
      this.formService.showPopup();
      this.formService.setOrderDetails({
        reference: this.orderReference,
        total: this.checkoutSummary.total,
      });
      return true;
    } else {
      this.formService.setPopupMessage(
        'There was an error processing your payment!'
      );
      this.formService.showPopup();
      return false;
    }
  }

  craftPayload(formData: any) {
    const paymentData = {
      clientReferenceInformation: {
        code: this.orderReference,
      },
      processingInformation: {
        capture: true,
      },
      paymentInformation: {
        card: {
          number: formData['Card Number'],
          expirationMonth: formData['Expiry Month'],
          expirationYear: formData['Expiry Year'],
          securityCode: formData['CVC'],
        },
      },
      orderInformation: {
        amountDetails: {
          totalAmount: this.checkoutSummary.total,
          currency: 'GBP',
        },
        billTo: {
          firstName: formData['First Name'],
          lastName: formData['Last Name'],
          address1: formData['Street Address'],
          locality: formData['Town / City'],
          administrativeArea: formData['County'],
          postalCode: formData['Postcode'],
          country: 'GB',
          email: formData['Email Address'],
          phoneNumber: formData['Phone'],
        },
      },
    };

    const paymentDataString = JSON.stringify(paymentData, null, 2);

    return paymentDataString;
  }

  toggleAddressBook() {
    if (this.addressBook.length === 0) {
      this.formService.setPopupMessage(
        'You have no addresses in your address book!',
        true,
        3000
      );
    } else {
      this.addressBookVisible = !this.addressBookVisible;
    }
  }

  clearAddressFields() {
    this.billingForm.get('Street Address')?.setValue('');
    this.billingForm.get('Street Address 2')?.setValue('');
    this.billingForm.get('Town / City')?.setValue('');
    this.billingForm.get('Postcode')?.setValue('');
  }

  selectAddress(address: any) {
    this.billingForm
      .get('Street Address')
      ?.setValue(address.delivery_address_one);
    this.billingForm
      .get('Street Address 2')
      ?.setValue(address.delivery_address_two);
    this.billingForm
      .get('Town / City')
      ?.setValue(address.delivery_address_three);
    this.billingForm.get('Postcode')?.setValue(address.delivery_postcode);
    this.addressBookVisible = false;
    this.saveAddress = false;
  }

  switchPaymentMethods() {
    this.paymentMethod =
      this.paymentMethod == PaymentMethod.Barclays
        ? PaymentMethod.PayPal
        : PaymentMethod.Barclays;
  }

  get PaymentMethod() {
    return PaymentMethod;
  }

  inputHasError(field: string) {
    return this.billingForm.get(field)?.invalid && this.submitted;
  }

  applyCoupon(coupon: Coupon) {
    this.coupon = coupon;
    this.calculateTotal(coupon);
  }
}
