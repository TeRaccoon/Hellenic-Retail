import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

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

  clipboardState: string = 'inactive';

  constructor(private cartService: CartService, private dataService: DataService, private route: ActivatedRoute, private router: Router, private clipboard: Clipboard, private location: Location) { }

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
        break;
    }
  }

  async loadProduct(productName: string) {
    this.dataService.collectData("product-view-details", productName).subscribe((data: any) => {
      this.product = data;
      this.outOfStock = this.product.quantity < 1 ? true : false;
      if (this.product.discount && this.product.discount != null) {
        this.oldPrice = this.product.price * ((100 - this.product.discount) / 100);
      }
    });
  }

  addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(productID, quantity);
  }
}