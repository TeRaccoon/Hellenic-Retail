import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface CartItem {
  productID: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<{ productID: number, quantity: number }[]>([]);
  private cartIDs = new BehaviorSubject<number[]>([]);

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        this.cartItems.next(parsedCart);
  
        const productIDs = parsedCart.map(product => product.productID);
        this.cartIDs.next(productIDs);
      } catch (error) {
        console.error('Error parsing stored cart:', error);
      }
    }
  }

  changeQuantity(productID: number, quantity: number) {
    const currentCartItems = this.cartItems.getValue();
    const existingCartItemIndex = currentCartItems.findIndex(cartItem => cartItem.productID === productID);
    if (existingCartItemIndex !== -1) {
      currentCartItems[existingCartItemIndex].quantity = quantity;
      this.cartItems.next(currentCartItems);
      localStorage.setItem('cart', JSON.stringify(currentCartItems));
    }
  }

  addToCart(productID: number, quantity: number) {
    const currentCartItems = this.cartItems.getValue();
    const existingCartItemIndex = currentCartItems.findIndex(cartItem => cartItem.productID === productID);
  
    if (existingCartItemIndex !== -1) {
      currentCartItems[existingCartItemIndex].quantity += quantity;
    } else {
      currentCartItems.push({ productID, quantity });
  
      const productIDs = currentCartItems.map(product => product.productID);
      this.cartIDs.next(productIDs);
    }
  
    this.cartItems.next(currentCartItems);
    localStorage.setItem('cart', JSON.stringify(currentCartItems));
  }

  removeFromCart(productID: number) {
    const currentCartItems = this.cartItems.getValue();
    const currentCartIds = this.cartIDs.getValue();
    if (productID != null) {
      const updatedCartItems = currentCartItems.filter((product) => product.productID != productID);
      const updatedCartIds = currentCartIds.filter((id) => id != productID);

      this.cartItems.next(updatedCartItems);
      this.cartIDs.next(updatedCartIds);

      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.cartIDs.next([]);
    localStorage.removeItem('cart');
  }

  getCartItems(): Observable<{ productID: number, quantity: number }[]> {
    return this.cartItems;
  }
  getIDs(): Observable<number[]> {
    return this.cartIDs;
  }
}