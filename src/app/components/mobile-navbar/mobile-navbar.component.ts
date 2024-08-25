import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCaretDown,
  faEnvelope,
  faSearch,
  faUser,
  faHeart,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { UrlService } from 'src/app/services/url.service'

@Component({
  selector: 'app-mobile-navbar',
  templateUrl: './mobile-navbar.component.html',
  styleUrls: ['./mobile-navbar.component.scss']
})
export class MobileNavbarComponent {
  faCaretDown = faCaretDown;
  faEnvelope = faEnvelope;
  faSearch = faSearch;
  faUser = faUser;
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  
  imageUrl: string;

  loginVisible = 'hidden';
  cartVisible = 'hidden';
  cartState: string = 'inactive';

  cartCount = 0;

  constructor(
    private urlService: UrlService, 
    private router: Router,
    private authService: AuthService,
    private formService: FormService,
    private cartService: CartService,
  ) {
    this.imageUrl = this.urlService.getUrl('uploads');;
  }

  ngOnInit() {
    this.getLoginVisibility();
    this.getCartUpdates();
  }

  async getLoginVisibility() {
    this.formService.getLoginFormVisibility().subscribe((visible) => {
      this.loginVisible = visible ? 'visible' : 'hidden';
    });
  }

  async getCartUpdates() {
    this.cartService
      .getUpdateRequest()
      .subscribe(async (updateRequested: boolean) => {
        if (updateRequested) {
          this.cartService.performUpdate();
          this.cartState = 'active';

          this.cartCount = (await this.cartService.getCart()).length;

          setTimeout(() => {
            this.cartState = 'inactive';
          }, 500);
        }
      });
  }

  async showAccount() {
    let isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/account']);
    } else {
      this.toggleLogin();
    }
  }
  
  async showWishlist() {
    let isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/wishlist']);
    } else {
      this.toggleLogin();
    }
  }
  
  toggleLogin() {
    this.loginVisible == 'hidden' && this.formService.showLoginForm();
  }
  toggleCart() {
    this.cartVisible == 'hidden' && this.formService.showCartForm();
  }
}