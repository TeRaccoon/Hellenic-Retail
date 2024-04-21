import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
  animations: [
    trigger('clipboardAnimation', [
      state('active', style({
        color: '#36b329'
      })),
      transition('inactive => active', [
        animate('0.2s')
      ]),
      transition('active => inactive', [
        animate('0.2s')
      ]),
    ]),
  ]
})
export class ViewDetailsComponent {
  faHeart = faHeart;
  faEye = faEye;
  faClipboard = faClipboard;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  
  product: any;
  outOfStock: boolean = true;
  fullPath: string = '';
  oldPrice: (number | null) = null;
  quantity = 1;
  inWishlist = false;

  clipboardState: string = 'inactive';

  constructor(private authService: AuthService, private cartService: CartService, private dataService: DataService, private route: ActivatedRoute, private router: Router, private clipboard: Clipboard, private location: Location, private formService: FormService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productName = params['productName'];
      this.fullPath = decodeURI(this.router.url);
      this.loadProduct(productName);
    });
  }

  share(option: string) {
    switch(option) {
      case 'clipboard':
        this.clipboard.copy("https://hellenicgrocery.co.uk/" + this.location.path());
        this.clipboardState = 'active';
        setTimeout(() => {
          this.clipboardState = 'inactive';
        }, 500);
        this.formService.setPopupMessage("Copied to clipboard!");
        this.formService.showPopup();
        break;
    }
  }

  async loadProduct(productName: string) {
    let productDetails = await lastValueFrom(this.dataService.collectData("product-view-details", productName));
    this.product = productDetails;
    this.outOfStock = this.product.quantity < 1 ? true : false;
    if (this.product.discount && this.product.discount != null) {
      this.oldPrice = this.product.price * ((100 - this.product.discount) / 100);
    }

    if (this.authService.isLoggedIn()) {
      let customerID = this.authService.getUserID();
      this.inWishlist = await lastValueFrom(this.dataService.collectDataComplex("is-product-in-wishlist", {id: customerID, product_id: this.product.id}));
    }
  }

  addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(productID, quantity);
  }
  
  addToWishlist(productID: number) {
    this.cartService.addToWishlist(productID);
  }

  buyNow(productID: number, quantity: number) {
    this.cartService.addToCart(productID, 1);
    this.cartService.changeQuantity(productID, quantity);
    this.router.navigate(['/checkout']);
  }
}