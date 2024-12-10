import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { FormService } from './form.service';
import { CartItem, CartProduct, CartUnit } from '../common/types/cart';
import { Product, ProductDetails } from '../common/types/shop';
import { Response } from '../common/types/data-response';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private total = 0;

  private updated = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private formService: FormService
  ) {
    this.loadCart();
  }

  private async loadCart() {
    this.authService
      .isLoggedInObservable()
      .subscribe(async (loggedIn: boolean) => {
        if (loggedIn) {
          let userId = this.authService.getCustomerID();
          if (userId !== null) {
            await this.loadCartDatabase(userId);
          }
        } else {
          this.loadCartLocalStorage();
        }

        this.requestUpdate();
      });
  }

  async loadCartDatabase(userId: string) {
    this.cart = await this.dataService.processPost({
      action: 'cart',
      customer_id: userId,
    });
    if (this.cart.length > 0 && this.cart[0].id == undefined) {
      this.cart = [];
    }
    this.cart = await this.checkCartStock();
  }

  async loadCartLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart: CartItem[] = JSON.parse(storedCart);
      this.cart = parsedCart;
    }
  }

  formatProduct(product: Product, cartItem: CartItem): CartProduct {
    let price = this.getProductPrice(product, cartItem.unit);
    let discountedPrice =
      product.discount !== 0 ? price * ((100 - product.discount) / 100) : price;

    let name = `${product.name} ${
      cartItem.unit === CartUnit.Unit ? '' : '(' + cartItem.unit + ')'
    }`;

    let total = price * cartItem.quantity;
    let discountedTotal = discountedPrice * cartItem.quantity;

    this.total += discountedTotal;

    let imageLocation =
      product.image_location === null
        ? 'placeholder.jpg'
        : product.image_location;

    return {
      name: name,
      price: total,
      discounted_price: discountedTotal,
      discount: product.discount,
      image_location: imageLocation,
    };
  }

  getProductPrice(product: Product, unit: CartUnit) {
    let customerType = this.authService.getCustomerType();
    switch (unit) {
      case 'Unit':
        return customerType == 'Retail'
          ? product.retail_price
          : product.wholesale_price;
      case 'Box':
        return product.box_price;
      case 'Pallet':
        return product.pallet_price;
      case 'Retail Box':
        return product.retail_box_price;
    }
    return 0;
  }

  async refreshCart() {
    let userId = this.authService.getCustomerID();
    if (userId !== null) {
      this.cart = await this.dataService.processPost({
        action: 'cart',
        customer_id: userId,
      });
    } else {
      let cart = localStorage.getItem('cart');
      if (cart) {
        this.cart = JSON.parse(cart);
      } else {
        this.cart = [];
      }
    }
    this.cart = await this.checkCartStock();
  }

  async addToCart(
    productId: number,
    quantity: number,
    unit: CartUnit = CartUnit.Unit,
    productName = '',
    multiplier: number = 1
  ) {
    let userId = this.authService.getCustomerID();

    if (quantity < 1) {
      this.formService.setPopupMessage('Quantity must be more than 1!', true);
      return;
    }

    if (userId !== null) {
      await this.addToCartDatabase(
        userId,
        productId,
        quantity,
        unit,
        multiplier
      );
    } else {
      await this.addToCartLocalStorage(
        productId,
        productName,
        quantity,
        unit,
        multiplier
      );
    }
  }

  async addToCartLocalStorage(
    productId: number,
    productName: string,
    quantity: number,
    unit: CartUnit = CartUnit.Unit,
    multiplier: number = 1
  ) {
    try {
      const currentCartItems = this.cart || [];

      const existingCartItemIndex = currentCartItems.findIndex(
        (cartItem) => cartItem.item_id === productId && cartItem.unit === unit
      );

      const isStockAvailable = await this.checkStock(
        quantity * multiplier,
        productId,
        true
      );

      if (!isStockAvailable) {
        this.formService.setPopupMessage('Item is out of stock!', true);
        return;
      }

      if (existingCartItemIndex !== -1) {
        const existingCartItem = currentCartItems[existingCartItemIndex];

        if (existingCartItem.quantity === quantity) {
          this.formService.setPopupMessage('Item already in basket!', true);
          return;
        }

        existingCartItem.quantity = quantity;
        this.formService.setPopupMessage('Cart item quantity updated!', true);
      } else {
        const newCartItem: CartItem = {
          id:
            currentCartItems.length > 0
              ? currentCartItems[currentCartItems.length - 1].id + 1
              : 1,
          item_id: productId,
          item_name: productName,
          quantity: quantity,
          unit: unit,
        };
        currentCartItems.push(newCartItem);
        this.formService.setPopupMessage('Item added to cart!', true);
      }

      await this.processLocalStorage(currentCartItems);
    } catch (error) {
      this.formService.setPopupMessage(
        'Failed to add item to cart. Please try again.',
        true
      );
    }
  }

  async processLocalStorage(updatedCart: CartItem[]) {
    try {
      this.cart = updatedCart;
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      await this.refreshCart();
      this.requestUpdate();
    } catch (error) {
      this.formService.setPopupMessage(
        'Failed to update cart. Please try again.',
        true
      );
    }
  }
  async addToCartDatabase(
    userId: string,
    productId: number,
    quantity: number,
    unit: CartUnit = CartUnit.Unit,
    multiplier: number = 1
  ) {
    let cart = await this.dataService.processPost({
      action: 'cart',
      customer_id: userId,
    });
    const rowIndex = cart.findIndex(
      (item: any) => item.item_id === productId && item.unit === unit
    );

    let response: Response | undefined;
    let popupMessage = 'Item added to cart!';

    if (await this.checkStock(quantity * multiplier, productId, true)) {
      if (rowIndex !== -1) {
        if (cart[rowIndex].quantity == quantity) {
          this.formService.setPopupMessage('Item already in basket!', true);
        } else {
          response = await this.dataService.processPost({
            action: 'update-cart',
            id: cart[rowIndex].id,
            quantity: quantity,
          });
          popupMessage = 'Cart updated!';
        }
      } else {
        response = await this.dataService.processPost({
          action: 'add-cart',
          customer_id: userId,
          product_id: productId,
          quantity: quantity,
          unit: unit,
        });
      }

      if (response?.success) {
        await this.refreshCart();
        this.formService.setPopupMessage(popupMessage, true);
        this.requestUpdate();
      } else {
        this.formService.setPopupMessage(
          'There was an issue adding this item!',
          true
        );
      }
    }
  }

  async checkStock(quantity: number, productId: number, showPopup = false) {
    let stock = (
      await this.dataService.processPost({
        action: 'check-stock',
        id: productId,
      })
    ).quantity;

    if (stock == null || stock < quantity) {
      showPopup &&
        this.formService.setPopupMessage(
          'There is no more stock of this item!',
          true
        );
      return false;
    }
    return true;
  }

  async removeFromCart(cartId: number) {
    let userId = this.authService.getCustomerID();
    if (userId !== null) {
      await this.removeFromCartDatabase(cartId, userId);
    } else {
      this.removeFromCartLocalStorage(cartId);
    }
  }

  async removeFromCartLocalStorage(cartId: number) {
    this.cart = this.cart.filter((cartItem: CartItem) => cartItem.id != cartId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.formService.setPopupMessage('Item removed successfully!', true);
    await this.refreshCart();
    this.requestUpdate();
  }

  async removeFromCartDatabase(cartId: number, userId: string) {
    let response: Response = await this.dataService.processPost({
      action: 'remove-cart',
      customer_id: userId,
      cart_id: cartId,
    });

    if (response.success) {
      this.formService.setPopupMessage('Item removed successfully!', true);
      await this.refreshCart();
      this.requestUpdate();
    } else {
      this.formService.setPopupMessage(
        'There was an issue removing this item!',
        true
      );
    }
  }

  async clearCart(showPopup = true) {
    let userId = this.authService.getCustomerID();
    if (userId !== null) {
      await this.clearCartDatabase(userId, showPopup);
    } else {
      this.clearCartLocalStorage(showPopup);
    }
  }

  async clearCartLocalStorage(showPopup = true) {
    localStorage.removeItem('cart');
    showPopup &&
      this.formService.setPopupMessage('Cart cleared successfully!', true);
    await this.refreshCart();
    this.requestUpdate();
  }

  async clearCartDatabase(userId: string, showPopup = true) {
    let response: Response = await this.dataService.processPost({
      action: 'clear-cart',
      customer_id: userId,
    });

    if (response.success) {
      showPopup &&
        this.formService.setPopupMessage('Cart cleared successfully!', true);
      await this.refreshCart();
      this.requestUpdate();
    } else {
      showPopup &&
        this.formService.setPopupMessage(
          'There was an issue clearing your cart!',
          true
        );
    }
  }

  async getCartItems(): Promise<CartProduct[]> {
    let cartProducts: CartProduct[] = [];
    if (this.cart.length > 0 && this.cart[0].id != null) {
      let total = 0;
      for (const item of this.cart) {
        let product: Product = await this.dataService.processGet(
          'product-from-id',
          { filter: item.item_id.toString() }
        );
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
      let customerID = this.authService.getCustomerID();
      if (customerID != null) {
        let form = {
          action: 'add',
          item_id: productID,
          customer_id: customerID,
          table_name: 'wishlist',
        };
        let inWishlist: any = await this.dataService.processGet(
          'is-product-in-wishlist',
          { id: customerID, product_id: productID },
          false
        );

        let popupMessage = 'Product already in wishlist!';

        if (inWishlist < 1) {
          let response = await lastValueFrom(
            this.dataService.submitFormData(form)
          );
          popupMessage = response.success
            ? 'Product added to wishlist!'
            : 'Whoops! Something went wrong. Please try again';
        }

        this.formService.setPopupMessage(popupMessage);
      }
    } else {
      this.formService.setPopupMessage('Please login to use your wishlist!');
    }
    this.formService.showPopup();
  }

  async removeFromWishlist(wishlistID: number) {
    let isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      let customerID = this.authService.getCustomerID();
      if (customerID != null) {
        let form = {
          action: 'delete',
          id: wishlistID,
          table_name: 'wishlist',
        };
        let response = await lastValueFrom(
          this.dataService.submitFormData(form)
        );
        let popupMessage = response.success
          ? 'Product removed from wishlist!'
          : 'Whoops! Something went wrong. Please try again';
        this.formService.setPopupMessage(popupMessage);
      }
    } else {
      this.formService.setPopupMessage('Please login to use your wishlist!');
    }
    this.formService.showPopup();
  }

  getQuantityMultiplier(
    product: ProductDetails,
    selectedUnit: CartUnit
  ): number {
    switch (selectedUnit) {
      case 'Box':
      case 'Retail Box':
        return product.box_size ?? 1;

      case 'Pallet':
        return product.pallet_size ?? 1;
    }

    return 1;
  }
}
