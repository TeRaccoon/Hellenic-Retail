import { forkJoin, lastValueFrom } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-checkout-order-summary',
  templateUrl: './checkout-order-summary.component.html',
  styleUrls: ['./checkout-order-summary.component.scss']
})
export class CheckoutOrderSummaryComponent {
  cart: { productID: number, quantity: number }[] = [];
  cartProducts: any[] = [];
  cartIDs: number[] = [];
  total = 0;
  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadData();
  }

  async loadData() {
    this.cart = this.cartService.getCartItems();
    this.cartIDs = this.cartService.getIDs();
    this.loadCartData();
  }

  async loadCartData() {
    let cartProducts: any[] = [];
    this.total = 0;
    await Promise.all(this.cartIDs.map(async(id) => {
      if (id !== null) {
        cartProducts.push(await lastValueFrom(this.dataService.collectData('product-from-id', id.toString())));
      }
    }));

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
