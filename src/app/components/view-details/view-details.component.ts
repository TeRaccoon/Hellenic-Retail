import { Component, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { CartItem, CartUnit } from 'src/app/common/types/cart';
import { ProductDetails } from 'src/app/common/types/shop';
import { CustomerType } from 'src/app/common/types/account';
import { CheckoutType } from 'src/app/common/types/checkout';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('clipboardAnimation', [
      state(
        'active',
        style({
          color: '#36b329',
        })
      ),
      transition('inactive => active', [animate('0.2s')]),
      transition('active => inactive', [animate('0.2s')]),
    ]),
  ],
})
export class ViewDetailsComponent {
  faHeart = faHeart;
  faEye = faEye;
  faClipboard = faClipboard;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faTwitter = faTwitter;

  product: ProductDetails | null = null;
  outOfStock: boolean = true;
  stock = 1;
  inWishlist = false;

  quantity = 1;
  quantityMultiplier = 1;
  unit: CartUnit = CartUnit.Unit;

  customerType: CustomerType = CustomerType.Retail;

  clipboardState: string = 'inactive';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private location: Location,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productName = params['productName'];
      this.loadProduct(productName);
    });
  }

  share(option: string) {
    switch (option) {
      case 'clipboard':
        this.clipboard.copy(
          'https://hellenicgrocery.co.uk/' + this.location.path()
        );
        this.clipboardState = 'active';
        setTimeout(() => {
          this.clipboardState = 'inactive';
        }, 500);
        this.formService.setPopupMessage('Copied to clipboard!');
        this.formService.showPopup();
        break;
    }
  }

  async loadProduct(productName: string) {
    await this.authService.checkLogin();
    this.customerType = this.authService.getCustomerType();

    let product: ProductDetails = await this.dataService.processGet(
      'product-view-details',
      { productName: productName },
      false
    );

    if (product == null || product.name == null) {
      this.router.navigate(['/shop']);
      return;
    }

    if (product.discount && product.discount != null) {
      product.discounted_price =
        product.price * ((100 - product.discount) / 100);
      if (product.box_price != null) {
        product.discounted_box_price =
          product.box_price * ((100 - product.discount) / 100);
      }

      if (product.pallet_price != null) {
        product.discounted_pallet_price =
          product.pallet_price * ((100 - product.discount) / 100);
      }

      if (product.retail_box_price != null) {
        product.discounted_retail_box_price =
          product.retail_box_price * ((100 - product.discount) / 100);
      }
    }

    this.product = product;

    let stock = await this.dataService.processGet('total-stock-by-id', {
      filter: product.id,
    });
    this.stock = stock.quantity;
    this.outOfStock = stock.quantity < 1;
  }

  addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(
      productID,
      quantity,
      this.unit,
      this.product?.name,
      this.quantityMultiplier
    );
  }

  addToWishlist() {
    this.product && this.cartService.addToWishlist(this.product.id);
  }

  viewSimilar() {
    this.product && this.router.navigate(['/shop/' + this.product.category]);
  }

  buyNow(productID: number, quantity: number) {
    let cartItem: CartItem = {
      id: null,
      item_id: productID,
      item_name: this.product!.name,
      quantity: quantity,
      unit: this.unit,
    };

    this.cartService.setCheckoutType(CheckoutType.BuyNow, cartItem);
    this.router.navigate(['/checkout']);
  }

  changePackageType(event: any) {
    this.unit = event.target.value;
    if (this.product) {
      this.quantityMultiplier = this.cartService.getQuantityMultiplier(
        this.product,
        this.unit
      );
    }
  }
}
