import { Component } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { UrlService } from 'src/app/services/url.service'

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  faX = faX;

  loggedIn = false;

  wishlistProducts: any[] = [];

  imageUrl;

  constructor(private urlService: UrlService, private cartService: CartService, private dataService: DataService, private authService: AuthService, private formService: FormService) {
    this.imageUrl = this.urlService.getUrl('uploads');;
  }

  ngOnInit() {
    this.formService.setBannerMessage("Wishlist");
    this.checkLogin();
  }

  async checkLogin() {
    this.loggedIn = true;
    this.loadWishlist();
  }

  async loadWishlist() {
    let userID = this.authService.getUserID();
    if (userID != null) {
      let wishlistProducts = await this.dataService.processGet("wishlist-from-id", {filter: userID}, true);
  
      wishlistProducts.forEach((product: any) => {
        if (product.discount && product.discount != null) {
          product.discounted_price = product.price * ((100 - product.discount) / 100);
        }

        if (!product.image && product.image == null) {
          product.image = 'placeholder.jpg';
        }
      });

      this.wishlistProducts = wishlistProducts;
    }
  }

  async removeFromWishlist(wishlistID: number) {
    await this.cartService.removeFromWishlist(wishlistID);
    this.checkLogin();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
