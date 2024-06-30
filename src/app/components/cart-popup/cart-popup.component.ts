import { forkJoin, lastValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { faX } from '@fortawesome/free-solid-svg-icons';

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
  displayProducts: any[] = [];
  cartIDs: number[] = [];
  subtotal = 0;
  loaded = false;
  imageUrl = '';
  confirmationPopupVisible = false;

  faX = faX;

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();

    this.formService.getCartFormVisibility().subscribe(async(visible) => {
      this.cartVisible = visible ? 'visible' : 'hidden';

      if (visible) {
        this.loaded = false;
        await this.getCartData();
        this.loaded = true;
        this.confirmationPopupVisible = false;
      }
    });
  }

  async getCartData() {
    this.cartIDs = this.cartService.getIDs();
    this.cart = this.cartService.getCartItems();
    this.loadCartData();
  }

  toggleCart() {
    let state = this.cartVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'hidden') {
      this.formService.hideCartForm();
    }
  }

  async removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.getCartData();
  }

  changeQuantity(event: any, productID: number) {
    const quantity = parseInt(event.target.value);
    this.cartService.changeQuantity(productID, quantity);
    this.getCartData();
  }

  changeConfirmationPopupState(visible: boolean) {
    this.confirmationPopupVisible = visible;
  }


  clearCart() {
    this.cartService.clearCart();
    this.confirmationPopupVisible = false;
    this.getCartData();
  }

  async loadCartData() {
    let cartProducts: any[] = [];
    this.subtotal = 0;
    await Promise.all(this.cartIDs.map(async(id) => {
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

        this.subtotal += product.discounted_total;

        if (product.image_location === null) {
          product.image_location = 'placeholder.jpg';
        }
      }
    });

    this.cartProducts = cartProducts;
  }
}
