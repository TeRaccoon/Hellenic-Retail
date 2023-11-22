import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-cart-popup',
  templateUrl: './cart-popup.component.html',
  styleUrls: ['./cart-popup.component.scss'],
  animations: [
    trigger('cartAnimation', [
      state('visible', style({ opacity: 1, display: 'block'})),
      state('hidden', style({ opacity: 0, display: 'none'})),
      transition('hidden => visible', animate('600ms ease', keyframes([
        style({opacity: 0, display: 'block', offset: 0}),
        style({opacity: 1, offset: 1})
      ]))),
      transition('visible => hidden', animate('600ms ease', keyframes([
        style({opacity: 1, offset: 0}),
        style({opacity: 0, display: 'none', offset: 1})
      ])))
    ]),
  ]
})
export class CartPopupComponent {
  cartVisible = 'visible';
  cart: { productID: number, quantity: number }[] = [];
  cartProducts: any[] = [];
  cartIDs: number[] = [];
  prices: number[] = [];

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.cart = this.cartService.getCartItems();

    this.formService.getCartFormVisibility().subscribe((visible) => {
      this.cartVisible = visible ? 'visible' : 'hidden';
    });

    this.cartService.getIDs().subscribe((ids) => {
      this.cartIDs = ids;
    });

    this.loadCartData();
  }

  toggleCart() {
    let state = this.cartVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'hidden') {
      this.formService.hideCartForm();
    }
  }
  async loadCartData() {
    this.cartService.getIDs().subscribe((ids) => {
      this.cartIDs = ids;
    });
    for (let i = 0; i < this.cartIDs.length; i++) {
      this.dataService.collectData('product-from-id', this.cartIDs[i].toString()).subscribe((product:any) => {

        this.cartProducts.push(product);
        let price = product.retail_price * this.cart[i].quantity;
        if (product.discount != null) {
          price = price * ((100 - product.discount) / 100);
        }
        this.prices.push(price);
      });
    }
  }
}
