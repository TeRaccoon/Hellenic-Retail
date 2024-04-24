import { Component } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  faX = faX;

  loggedIn = false;

  wishlistProducts: any[] = [];

  constructor(private cartService: CartService, private dataService: DataService, private authService: AuthService, private formService: FormService) {}

  ngOnInit() {
    this.formService.setBannerMessage("Wishlist");
    this.checkLogin();
  }

  async checkLogin() {
    let isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.loggedIn = true;
      this.loadWishlist();
    } else {
      this.formService.showLoginForm();
    }   
  }

  async loadWishlist() {
    let userID = this.authService.getUserID();
    if (userID != null) {
      let wishlistProducts = await lastValueFrom(this.dataService.collectData("wishlist-from-id", userID));
      wishlistProducts = Array.isArray(wishlistProducts) ? wishlistProducts : [wishlistProducts];
  
      this.wishlistProducts = wishlistProducts;
    }
  }

  async removeFromWishlist(wishlistID: number) {
    await this.cartService.removeFromWishlist(wishlistID);
    this.checkLogin();
  }
}
