import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { RenderService } from 'src/app/services/render.service';
import {
  faCaretDown,
  faEnvelope,
  faSearch,
  faUser,
  faHeart,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CartService } from 'src/app/services/cart.service';
import { FilterService } from 'src/app/services/filter.service';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private formService: FormService,
    private filterService: FilterService,
    private cartService: CartService,
    private renderService: RenderService
  ) {
    this.imageUrl = this.dataService.getUploadURL();
  }

  ngOnInit() {
    this.getLoginVisibility();
    this.getCartUpdates();
    this.renderService.getScreenSize().subscribe(size => {
      this.screenSize = size;
    });

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
    this.cartService.getUpdateRequest().subscribe(async (updateRequested: boolean) => {
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
    this.categories = this.dataService.getVisibleCategoryNames();

    let subcategories = await lastValueFrom(
      this.dataService.collectData('subcategories')
    );
    if (subcategories != null) {
      this.subcategories = subcategories;
    }

    let products: any = await this.dataService.collectDataComplex('products');
    products = Array.isArray(products) ? products : [products];

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
    this.searchResults = this.filterService.applyCategoryFilter(this.categoryFilter, this.searchStringFilter, this.products);
  }

  searchFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchStringFilter = inputElement.value.trim().toLowerCase();
    this.searchResults = this.filterService.applyCategoryFilter(this.categoryFilter, this.searchStringFilter, this.products);
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
    } else if (this.categoryFilter == null || this.categoryFilter == 'all') {
      this.router.navigate(['/shop/']);
    } else {
      this.router.navigate(['/shop/' + this.categoryFilter]);
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
