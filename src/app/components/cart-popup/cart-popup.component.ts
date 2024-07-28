import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { CartItem, CartProduct } from 'src/app/common/types/cart';
import { AuthService } from 'src/app/services/auth.service';

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
  cart: CartItem[] = [];
  cartProducts: CartProduct[] = [];
  displayProducts: any[] = [];
  subtotal = 0;
  loaded = false;
  imageUrl = '';
  confirmationPopupVisible = false;

  faX = faX;

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService, private authService: AuthService) {}

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
    this.cart = await this.cartService.getCart();
    this.loadCartData();
  }

  toggleCart() {
    let state = this.cartVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'hidden') {
      this.formService.hideCartForm();
    }
  }

  async removeFromCart(productId: number) {
    await this.cartService.removeFromCart(productId);
    await this.getCartData();
  }

  async changeQuantity(event: any, productID: number) {
    const quantity = parseInt(event.target.value);
    await this.cartService.addToCart(productID, quantity);
    await this.getCartData();
  }

  changeConfirmationPopupState(visible: boolean) {
    this.confirmationPopupVisible = visible;
  }


  async clearCart() {
    await this.cartService.clearCart();
    this.confirmationPopupVisible = false;
    await this.getCartData();
  }

  async loadCartData() {
    this.cartProducts = await this.cartService.getCartItems();
    this.subtotal = this.cartService.getCartTotal();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
