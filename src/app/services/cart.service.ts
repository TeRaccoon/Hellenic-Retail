import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { FormService } from './form.service';

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

  constructor(private authService: AuthService, private dataService: DataService, private formService: FormService) {
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

  async addToWishlist(productID: number) {
    let customerEmail = this.authService.getUserEmail();
    if (customerEmail != null) {
      let customerID = await lastValueFrom(this.dataService.collectData("user-id-from-email", customerEmail));
      
      let form = {
        action: "add",
        retail_item_id: productID,
        customer_id: customerID,
        table_name: "wishlist"
      };
      let response = await lastValueFrom(this.dataService.submitFormData(form));
      let popupMessage = response.success ? "Product Added" : "Whoops! Something went wrong. Please try again"
      this.formService.setPopupMessage(popupMessage);
    } else {
      this.formService.setPopupMessage("Please login to use your wishlist!");
    }
    this.formService.showPopup();
  }
}