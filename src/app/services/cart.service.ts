import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { productID: number, quantity: number }[] = [];
  private cartIDs = new BehaviorSubject<number[]>([]);

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      const productIDs = this.cartItems.map(product => product.productID);
      this.cartIDs.next(productIDs);
    }
  }

  addToCart(productID: number, quantity: number) {
    const existingCartItem = this.cartItems.find(cartItem => cartItem.productID === productID);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      this.cartItems.push({ productID, quantity });

      const productIDs = this.cartItems.map(product => product.productID)
      productIDs.push(productID);
      this.cartIDs.next(productIDs);
      
      console.log(this.cartIDs);
    }
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  getCartItems() {
    return this.cartItems;
  }
  getIDs(): Observable<number[]> {
    return this.cartIDs;
  }
}