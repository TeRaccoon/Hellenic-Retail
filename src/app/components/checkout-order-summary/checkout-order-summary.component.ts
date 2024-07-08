import { lastValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { CartItem } from 'src/app/common/types/cart';

@Component({
  selector: 'app-checkout-order-summary',
  templateUrl: './checkout-order-summary.component.html',
  styleUrls: ['./checkout-order-summary.component.scss']
})
export class CheckoutOrderSummaryComponent {
  cart: CartItem[] = [];
  cartProducts: any[] = [];
  total = 0;
  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.getCartData();
  }

  async getCartData() {
    this.cart = this.cartService.getCart();
    this.cartService.getUpdateRequest().subscribe((updateRequested: boolean) => {
      if (updateRequested) {
        this.loadCartData();
      }
    })
  }

  async loadCartData() {
    this.cart = this.cartService.getCart();
    let cartProducts: any[] = await this.cartService.getCartItems();
    this.total = 0;

    cartProducts.forEach((product, index) => {
      if (this.cart[index] && product != null) {
        let individualPrice = product.retail_price;
        let discountedPrice = individualPrice;
        if (product.discount != null) {
          discountedPrice = individualPrice * ((100 - product.discount) / 100);
        }

        product.total = individualPrice * this.cart[index].quantity;
        product.discounted_total = discountedPrice * this.cart[index].quantity;

        this.total += product.discounted_total;

        if (product.image_location === null) {
          product.image_location = 'placeholder.jpg';
        }
      }
    });

    this.cartProducts = cartProducts;
  }
}
