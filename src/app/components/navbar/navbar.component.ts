import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { faCaretDown, faEnvelope, faSearch, faUser, faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('cartAnimation', [
      state('active', style({
        color: '#36b329'
      })),
      state('inactive', style({
        color: '#000000'
      })),
      transition('inactive => active', [
        animate('0.4s ease-in-out')
      ]),
      transition('active => inactive', [
        animate('0.4s ease-in-out')
      ]),
    ]),
  ]
})

export class NavbarComponent {
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
  categoryFilter: string | null = null;
  searchStringFilter = "";

  loginVisible = 'hidden';
  cartVisible = 'hidden';
  cartState: string = 'inactive';

  imageUrl = '';

  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private formService: FormService, private cartService: CartService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();

    this.getLoginVisibility();
    this.getCartUpdates();

    this.loadNavBar();
  }

  async getLoginVisibility() {
    this.formService.getLoginFormVisibility().subscribe((visible) => {
      this.loginVisible = visible ? 'visible' : 'hidden';
    });
  }

  async getCartUpdates() {
    this.cartService.getUpdateRequest().subscribe((updateRequested: boolean) => {
      if (updateRequested) {
        this.cartService.performUpdate();
        this.cartState = 'active';
        
        setTimeout(() => {
          this.cartState = 'inactive';
        }, 500);
      }
    });
  }

  async loadNavBar() {
    let categories = await lastValueFrom(this.dataService.collectData("categories"));
    if (categories != null) {
      this.categories = categories;
    }

    let subcategories = await lastValueFrom(this.dataService.collectData("subcategories"));
    if (subcategories != null) {
      this.subcategories = subcategories;
    }

    let products = await lastValueFrom(this.dataService.collectDataComplex("products"));
    if (products != null) {
      products = this.replaceNullImages(products);
      products = this.calculatePrices(products);

      this.products = products;
      this.searchResults = products;
    }
  }

  calculatePrices(products: any[]) {
    return products.map(product => {
      return { ...product, discounted_price: product.discount === null ? null : product.price * ((100 - product.discount ) / 100)};
    });
  }

  replaceNullImages(products: any[]) {
    return products.map(product => {
      return { ...product, image_location: product['image_location'] == null ? this.imageUrl + "placeholder.jpg" : this.imageUrl + product['image_location'] };
    });
  }

  changeCategory(event: Event) {
    const option = event.target as HTMLInputElement;
    const value = option.value.toLowerCase();
    this.categoryFilter = value === 'all' ? null : value;
    this.applyFilters();
  }
  
  searchFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchStringFilter = inputElement.value.trim().toLowerCase();
    this.applyFilters();
  }
  
  applyFilters() {
    if (this.categoryFilter === null && !this.searchStringFilter) {
      this.searchResults = this.products;
      return;
    }
  
    this.searchResults = this.products.filter(product =>
      (this.categoryFilter === null || product.category?.toLowerCase() === this.categoryFilter) &&
      (!this.searchStringFilter || product.name.toLowerCase().includes(this.searchStringFilter))
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

  toggleLogin() {
    this.loginVisible == 'hidden' && this.formService.showLoginForm(); 
  }
  toggleCart() {
    this.cartVisible == 'hidden' && this.formService.showCartForm();
  }
}
