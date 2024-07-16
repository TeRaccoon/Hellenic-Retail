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
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private formService: FormService,
    private cartService: CartService,
  ) {
    this.imageUrl = this.dataService.getUploadURL();
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
      .subscribe((updateRequested: boolean) => {
        if (updateRequested) {
          this.cartService.performUpdate();
          this.cartState = 'active';

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