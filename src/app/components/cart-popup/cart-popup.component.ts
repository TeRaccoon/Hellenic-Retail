import { forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
  displayProducts: any[] = [];
  cartIDs: number[] = [];
  prices: number[] = [];
  subtotal = 0;
  loaded = false;

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.formService.getCartFormVisibility().subscribe((visible) => {
      this.cartVisible = visible ? 'visible' : 'hidden';
    });

    this.cartService.getIDs().subscribe((ids) => {
      this.cartIDs = ids;
    });

    this.cartService.getCartItems().subscribe((items) => {
      this.cart = items;
      this.loaded = false;
      this.loadCart();
    });

  }
  async loadCart() {
    await this.loadCartData();
    this.loaded = true;
  }

  toggleCart() {
    let state = this.cartVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'hidden') {
      this.formService.hideCartForm();
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  changeQuantity(event: any, productID: number) {
    const quantity = parseInt(event.target.value);
    this.cartService.changeQuantity(productID, quantity);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  loadCartData() {
    this.cartProducts = [];
    this.subtotal = 0;
    this.prices = [];
    const observables = this.cartIDs.map(id =>
      this.dataService.collectData('product-from-id', id.toString())
    );
  
    forkJoin(observables).pipe(
      tap((products: any[]) => {
        products.forEach((product, i) => {
          if (this.cart[i]) {
            this.cartProducts.push(product);
  
            let price = product.retail_price * this.cart[i].quantity;
            this.subtotal += price;
    
            if (product.discount != null) {
              price = price * ((100 - product.discount) / 100);
            }
    
            this.prices.push(price);
          }
        });
      }),
      catchError(error => {
        console.error('Error in loadCartData:', error);
        throw error;
      })
    ).subscribe();
  }
}
