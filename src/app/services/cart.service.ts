import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { FormService } from './form.service';
import { CartItem, CartUnit } from '../common/types/cart';
import { Product } from '../common/types/shop';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];
  private updated = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, private dataService: DataService, private formService: FormService) {
    this.loadCart();
  }

  private async loadCart() {
    this.authService.isLoggedInObservable().subscribe(async (loggedIn: boolean) => {
      if (loggedIn) {
        let userId = this.authService.getUserID();
        if (userId !== null) {
          this.cart = await lastValueFrom<any>(this.dataService.processPost({'action': 'cart', 'customer_id': userId}));
        }
        this.requestUpdate();
      }
    });
  }

  async refreshCart() {
    let userId = this.authService.getUserID();
    if (userId !== null) {
      this.cart = await lastValueFrom<any>(this.dataService.processPost({'action': 'cart', 'customer_id': userId}));
    }
  }

  async addToCart(productId: number, quantity: number, unit: CartUnit = CartUnit.Unit) {
    let userId = this.authService.getUserID();
    if (userId !== null) {
      let cart = await lastValueFrom<any>(this.dataService.processPost({'action': 'cart', 'customer_id': userId}));      
      const rowIndex = cart.findIndex((item: any) => item.item_id === productId && item.unit === unit);

      let response: any = null;
      if (await this.checkStock(quantity, productId)) {
        if (rowIndex !== -1) {
          response = await lastValueFrom(this.dataService.processPost({'action': 'update-cart', 'id': cart[rowIndex].id,'quantity': quantity}));
        } else {
          response = await lastValueFrom(this.dataService.processPost({'action': 'add-cart', 'customer_id': userId, 'product_id': productId, 'quantity': quantity, 'unit': unit}));
        }
  
        if (response) {
          await this.refreshCart();
          this.formService.setPopupMessage("Item added to cart!", true);
          this.requestUpdate();
        } else {
          this.formService.setPopupMessage("There was an issue adding this item!", true);
        }
      }
    } else {
      this.formService.setPopupMessage("Please sign in to use your cart!", true);
    }
  }

  async checkStock(quantity: number, productId: number) {
    let response: any = await lastValueFrom(this.dataService.processPost({'action': 'check-stock', 'id': productId}));
    if (response.quantity < quantity) {
      this.formService.setPopupMessage("There is no more stock of this item!", true);
      return false;
    }
    return true
  }

  async removeFromCart(productId: number) {
    let userId = this.authService.getUserID();
    if (userId !== null) {
      if (await lastValueFrom(this.dataService.processPost({'action': 'remove-cart', 'customer_id': userId, 'product_id': productId}))) {
        this.formService.setPopupMessage("Item removed successfully!", true);
        await this.refreshCart();
        this.requestUpdate();
      } else {
        this.formService.setPopupMessage("There was an issue removing this item!", true);
      }
    }
  }

  async clearCart() {
    let userId = this.authService.getUserID();
    if (userId !== null) {
      if (await lastValueFrom(this.dataService.processPost({'action': 'clear-cart', 'customer_id': userId}))) {
        this.formService.setPopupMessage("Cart cleared successfully!", true);
        await this.refreshCart();
        this.requestUpdate();
      } else {
        this.formService.setPopupMessage("There was an issue clearing your cart!", true);
      }
    }
  }

  async getCartItems(): Promise<Product[]> {
    let cartItems: Product[] = [];
    console.log(this.cart);
    if (this.cart.length > 0 && this.cart[0].id) {
      for (let item of this.cart) {
        let cartRow: Product = await lastValueFrom(this.dataService.collectData('product-from-id', item.item_id.toString()));
        cartItems.push(cartRow);
      }
    }

    return cartItems;
  }

  getCart() {
    if (this.cart.length > 0 && this.cart[0].id == undefined) {
      this.cart = [];
    }
    return this.cart;
  }

  getUpdateRequest(): Observable<boolean> {
    return this.updated.asObservable();
  }

  requestUpdate() {
    this.updated.next(true);
  }

  performUpdate() {
    // this.updated.next();
  }

  async addToWishlist(productID: number) {
    let isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      let customerID = this.authService.getUserID();
      if (customerID != null) {      
        let form = {
          action: "add",
          item_id: productID,
          customer_id: customerID,
          table_name: "wishlist"
        };
        let inWishlist: any = await this.dataService.collectDataComplex("is-product-in-wishlist", {id: customerID, product_id: productID});

        let popupMessage = "Product already in wishlist!";
        
        if (inWishlist < 1) {
          let response = await lastValueFrom(this.dataService.submitFormData(form));
          popupMessage = response.success ? "Product added to wishlist!" : "Whoops! Something went wrong. Please try again";
        }

        this.formService.setPopupMessage(popupMessage);
      }
    } else {
      this.formService.setPopupMessage("Please login to use your wishlist!");
    }
    this.formService.showPopup();
  }

  async removeFromWishlist(wishlistID: number) {
    let isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      let customerID = this.authService.getUserID();
      if (customerID != null) {      
        let form = {
          action: "delete",
          id: wishlistID,
          table_name: "wishlist"
        };
        let response = await lastValueFrom(this.dataService.submitFormData(form));
        let popupMessage = response.success ? "Product removed from wishlist!" : "Whoops! Something went wrong. Please try again";
        this.formService.setPopupMessage(popupMessage);
      }
    } else {
      this.formService.setPopupMessage("Please login to use your wishlist!");
    }
    this.formService.showPopup();
  }
}