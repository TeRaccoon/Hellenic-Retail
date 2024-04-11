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
  private cartItems: { productID: number, quantity: number }[] = [];
  private cartIDs: number[] = [];
  private updated = new BehaviorSubject<boolean>(false);

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        this.cartItems = (parsedCart);
  
        const productIDs = parsedCart.map(product => product.productID);
        this.cartIDs = (productIDs);
      } catch (error) {
        console.error('Error parsing stored cart:', error);
      }
    }
  }

  changeQuantity(productID: number, quantity: number) {
    const currentCartItems = this.cartItems;
    const existingCartItemIndex = currentCartItems.findIndex(cartItem => cartItem.productID === productID);
    if (existingCartItemIndex !== -1) {
      currentCartItems[existingCartItemIndex].quantity = quantity;
      this.cartItems = currentCartItems;
      localStorage.setItem('cart', JSON.stringify(currentCartItems));
    }
  }

  addToCart(productID: number, quantity: number) {
    const currentCartItems = this.cartItems;
    const existingCartItemIndex = currentCartItems.findIndex(cartItem => cartItem.productID === productID);
  
    if (existingCartItemIndex !== -1) {
      currentCartItems[existingCartItemIndex].quantity += quantity;
    } else {
      currentCartItems.push({ productID, quantity });
  
      const productIDs = currentCartItems.map(product => product.productID);
      this.cartIDs = productIDs;
    }
  
    this.cartItems = currentCartItems;
    localStorage.setItem('cart', JSON.stringify(currentCartItems));

    this.requestUpdate();
  }

  removeFromCart(productID: number) {
    const currentCartItems = this.cartItems;
    const currentCartIds = this.cartIDs;
    if (productID != null) {
      const updatedCartItems = currentCartItems.filter((product) => product.productID != productID);
      const updatedCartIds = currentCartIds.filter((id) => id != productID);

      this.cartItems = updatedCartItems;
      this.cartIDs = updatedCartIds;

      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    }
  }

  clearCart() {
    this.cartItems = [];
    this.cartIDs = [];
    localStorage.removeItem('cart');
  }

  getCartItems() {
    return this.cartItems;
  }

  getIDs() {
    return this.cartIDs;
  }

  getUpdateRequest(): Observable<boolean> {
    return this.updated.asObservable();
  }

  requestUpdate() {
    this.updated.next(true);
  }

  performUpdate() {
    this.updated.next(false);
  }
}