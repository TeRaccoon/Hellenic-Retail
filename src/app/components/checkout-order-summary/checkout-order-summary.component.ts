import { lastValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { CartItem, CartProduct } from 'src/app/common/types/cart';
import { CheckoutSummary } from 'src/app/common/types/checkout';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-checkout-order-summary',
  templateUrl: './checkout-order-summary.component.html',
  styleUrls: ['./checkout-order-summary.component.scss']
})
export class CheckoutOrderSummaryComponent {
  cart: CartItem[] = [];
  cartProducts: CartProduct[] = [];
  checkoutSummary: CheckoutSummary;
  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private checkoutService: CheckoutService) {
    this.checkoutSummary = checkoutService.getCheckoutSummary();
  }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.getCartData();
    this.getCheckoutSummary();
  }

  async getCartData() {
    this.cart = this.cartService.getCart();
    this.cartService.getUpdateRequest().subscribe((updateRequested: boolean) => {
      if (updateRequested) {
        this.loadCartData();
      }
    })
  }

  async getCheckoutSummary() {
    this.checkoutService.getCheckoutSummaryObservable().subscribe((checkoutSummary: CheckoutSummary) => {
      this.checkoutSummary = checkoutSummary;
    });
  }

  async loadCartData() {
    this.cart = this.cartService.getCart();
    this.cartProducts = await this.cartService.getCartItems();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
