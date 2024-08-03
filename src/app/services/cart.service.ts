import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { FormService } from './form.service';
import { CartItem, CartProduct, CartUnit } from '../common/types/cart';
import { Product } from '../common/types/shop';
import { Response } from '../common/types/data-response';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];
  private total = 0;
  
  private updated = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, private dataService: DataService, private formService: FormService) {
    this.loadCart();
  }

  private async loadCart() {
    this.authService.isLoggedInObservable().subscribe(async (loggedIn: boolean) => {
      if (loggedIn) {
        let userId = this.authService.getUserID();
        if (userId !== null) {
          this.cart = await this.dataService.processPost({'action': 'cart', 'customer_id': userId});
          if (this.cart.length > 0 && this.cart[0].id == undefined) {
            this.cart = [];
          }
          this.cart = await this.checkCartStock();
        }
        this.requestUpdate();
      }
    });
  }

  formatProduct(product: Product, cartItem: CartItem): CartProduct {
    let price = this.getProductPrice(product, cartItem.unit);
    let discountedPrice = product.discount !== 0 ? price * ((100 - product.discount) / 100) : price;

    let name = `${product.name} ${cartItem.unit === CartUnit.Unit ? '' : '(' + cartItem.unit + ')'}`;

    let total = price * cartItem.quantity;
    let discountedTotal = discountedPrice * cartItem.quantity;

    this.total += discountedTotal;

    let imageLocation = product.image_location === null ? 'placeholder.jpg' : product.image_location;

    return {
      name: name,
      price: total,
      discounted_price: discountedTotal,
      discount: product.discount,
      image_location: imageLocation
    };
  }

  getProductPrice(product: Product, unit: CartUnit) {
    let customerType = this.authService.getUserType();
    switch(unit) {
      case 'Unit':
        return customerType == 'Retail' ? product.retail_price : product.wholesale_price;
      case 'Box':
        return product.box_price;
      case 'Pallet':
        return product.pallet_price;
    }
    return 0;
  }

  async refreshCart() {
    let userId = this.authService.getUserID();
    if (userId !== null) {
      this.cart = await this.dataService.processPost({'action': 'cart', 'customer_id': userId});
      this.cart = await this.checkCartStock();
    }
  }

  async addToCart(productId: number, quantity: number, unit: CartUnit = CartUnit.Unit) {
    let userId = this.authService.getUserID();
    if (userId !== null) {
      let cart = await this.dataService.processPost({'action': 'cart', 'customer_id': userId});      
      const rowIndex = cart.findIndex((item: any) => item.item_id === productId && item.unit === unit);

      let response: any = null;
      if (await this.checkStock(quantity, productId, true)) {
        if (rowIndex !== -1) {
          if (cart[rowIndex].quantity == quantity) {
            this.formService.setPopupMessage("Item already in basket!", true);
          } else {
            response = await this.dataService.processPost({'action': 'update-cart', 'id': cart[rowIndex].id,'quantity': quantity});
          }
        } else {
          response = await this.dataService.processPost({'action': 'add-cart', 'customer_id': userId, 'product_id': productId, 'quantity': quantity, 'unit': unit});
        }
  
        if (response.success) {
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

  async checkStock(quantity: number, productId: number, showPopup = false) {
    let response = await this.dataService.processPost({'action': 'check-stock', 'id': productId});
    if (response.quantity == null || response.quantity < quantity) {
      showPopup && this.formService.setPopupMessage("There is no more stock of this item!", true);
      return false;
    }
    return true
  }

  async removeFromCart(productId: number) {
    let userId = this.authService.getUserID();
    if (userId !== null) {
      let response: Response = await this.dataService.processPost({'action': 'remove-cart', 'customer_id': userId, 'product_id': productId})

      if (response.success) {
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
      let response: Response = await this.dataService.processPost({'action': 'clear-cart', 'customer_id': userId});

      if (response.success) {
        this.formService.setPopupMessage("Cart cleared successfully!", true);
        await this.refreshCart();
        this.requestUpdate();
      } else {
        this.formService.setPopupMessage("There was an issue clearing your cart!", true);
      }
    }
  }

  async getCartItems(): Promise<CartProduct[]> {
    let cartProducts: CartProduct[] = [];
    if (this.cart.length > 0 && this.cart[0].id) {
      let total = 0;
      for (const item of this.cart) {
        let product: Product = await this.dataService.processGet('product-from-id', {filter: item.item_id.toString()});
        let formattedProduct = this.formatProduct(product, item);

        total += formattedProduct.discounted_price;

        cartProducts.push(formattedProduct);
      }
        
      this.total = total;
    }

    return cartProducts;
  }

  getCartTotal() {
    return this.total;
  }

  async getCart(checkStock = false) {
    if (this.cart.length > 0 && this.cart[0].id == undefined) {
      this.cart = [];
    }
    checkStock && (this.cart = await this.checkCartStock());

    return this.cart;
  }

  async checkCartStock() {
    let cart: CartItem[] = [];
    if (this.cart.length > 0 && this.cart[0].id == undefined) {
      this.cart = [];
    }
    for (let item of this.cart) {
      if (await this.checkStock(item.quantity, item.item_id)) {
        cart.push(item);
      }
    }

    return cart;
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
        let inWishlist: any = await this.dataService.processGet("is-product-in-wishlist", {id: customerID, product_id: productID}, true);

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