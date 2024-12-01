import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { RenderService } from 'src/app/services/render.service';
import { UrlService } from 'src/app/services/url.service';
import {
  faCaretDown,
  faEnvelope,
  faSearch,
  faUser,
  faHeart,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CartService } from 'src/app/services/cart.service';
import { FilterService } from 'src/app/services/filter.service';
import { CacheService } from 'src/app/services/cache.service';
import { ConstManager, settingKeys } from 'src/app/common/const/const-manager';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('cartAnimation', [
      state(
        'active',
        style({
          color: '#36b329',
        })
      ),
      state(
        'inactive',
        style({
          color: '#000000',
        })
      ),
      transition('inactive => active', [animate('0.4s ease-in-out')]),
      transition('active => inactive', [animate('0.4s ease-in-out')]),
    ]),
  ],
})
export class NavbarComponent {
  screenSize: any = {};

  faCaretDown = faCaretDown;
  faEnvelope = faEnvelope;
  faSearch = faSearch;
  faUser = faUser;
  faHeart = faHeart;
  faCartShopping = faCartShopping;

  categories: string[] = [];
  subcategories: any[] = [];
  products: any[] = [];

  searchResults: any[] = [];
  categoryFilter: string = 'all';
  searchStringFilter = '';

  loginVisible = 'hidden';
  cartVisible = 'hidden';
  cartState: string = 'inactive';

  cartCount = 0;

  imageUrl: string;

  email;

  message = 'Welcome to Hellenic Grocery';

  constructor(
    private urlService: UrlService,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private formService: FormService,
    private filterService: FilterService,
    private cartService: CartService,
    private renderService: RenderService,
    private cacheService: CacheService,
    private consts: ConstManager
  ) {
    this.imageUrl = this.urlService.getUrl('uploads');
    this.email = this.consts.getConstant(settingKeys.support_email);
  }

  ngOnInit() {
    this.getLoginVisibility();
    this.getCartUpdates();
    this.renderService.getScreenSize().subscribe((size) => {
      this.screenSize = size;
    });

    this.message =
      this.authService.getUserType() == 'Retail'
        ? 'Welcome to Hellenic Grocery'
        : 'Welcome to Hellenic Grocery Wholesale';

    this.loadCart();
    this.loadNavBar();
  }

  async loadCart() {
    await this.cartService.refreshCart();
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

  async loadNavBar() {
    this.categories = (await this.cacheService.getCategories()).map(
      (c) => c.name
    );

    let subcategories = await this.dataService.processGet('subcategories');
    if (subcategories != null) {
      this.subcategories = subcategories;
    }

    let products: any = await this.dataService.processGet(
      'products',
      {},
      true,
      false
    );

    if (products != null) {
      products = this.replaceNullImages(products);
      products = this.calculatePrices(products);

      this.products = products;
      this.searchResults = products;
    }
  }

  calculatePrices(products: any[]) {
    return products.map((product) => {
      return {
        ...product,
        discounted_price:
          product.discount === null
            ? null
            : product.price * ((100 - product.discount) / 100),
      };
    });
  }

  replaceNullImages(products: any[]) {
    return products.map((product) => {
      return {
        ...product,
        image_location:
          product['image_location'] == null
            ? this.imageUrl + 'placeholder.jpg'
            : this.imageUrl + product['image_location'],
      };
    });
  }

  changeCategory(event: Event) {
    this.categoryFilter = (event.target as HTMLInputElement).value;
    this.searchResults = this.filterService.applyCategoryFilter(
      this.categoryFilter,
      this.searchStringFilter,
      this.products
    );
  }

  searchFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchStringFilter = inputElement.value.trim().toLowerCase();
    this.searchResults = this.filterService.applyCategoryFilter(
      this.categoryFilter,
      this.searchStringFilter,
      this.products
    );
  }

  onInputFocus() {
    const dropdown = document.querySelector('.search-dropdown-items');
    if (dropdown) {
      dropdown.classList.add('focused');
    }
  }

  onInputBlur() {
    const dropdown = document.querySelector('.search-dropdown-items');
    if (dropdown) {
      dropdown.classList.remove('focused');
    }
  }

  search() {
    if (this.searchResults.length == 1) {
      this.router.navigate(['/view/' + this.searchResults[0].name]);
    } else if (this.categoryFilter != 'all' && this.searchStringFilter == '') {
      this.router.navigate(['/shop/' + this.categoryFilter]);
    } else {
      this.dataService.setShopFilter(this.searchStringFilter);
      this.router.navigate(['/shop']);
    }
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

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
