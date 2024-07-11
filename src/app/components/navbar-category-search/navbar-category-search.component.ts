import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faBars, faCartShopping, faHeart, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-navbar-category-search',
  templateUrl: './navbar-category-search.component.html',
  styleUrls: ['./navbar-category-search.component.scss']
})
export class NavbarCategorySearchComponent {
  faBars = faBars;
  faUser = faUser;
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  faSearch = faSearch;

  loginVisible = 'hidden';
  cartVisible = 'hidden';
  cartState: string = 'inactive';
  
  subcategories: any[] = [];
  categories: string[] = [];
  categoriesShown = false;
  products: any[] = [];

  searchResults: any[] = [];
  categoryFilter: string | null = null;
  searchStringFilter = "";
  imageUrl: string;

  constructor(private dataService: DataService, private authService: AuthService, private formService: FormService, private router: Router) {
    this.imageUrl = this.dataService.getUploadURL();
  }

  ngOnInit() {
    this.loadNavBar();
    this.categories = this.dataService.getVisibleCategoryNames();
  }

  async loadNavBar() {
    this.categories = this.dataService.getVisibleCategoryNames();

    let subcategories = await lastValueFrom(
      this.dataService.collectData('subcategories')
    );
    if (subcategories != null) {
      this.subcategories = subcategories;
    }

    let products = await lastValueFrom(
      this.dataService.collectDataComplex('products')
    );
    products = Array.isArray(products) ? products : [products];

    if (products != null) {
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

  goToCategory(category: string) {
    this.dataService.setShopFilter(null);
    this.router.navigate(["/shop/" + category]);
  }

  toggleCategory() {
    this.categoriesShown = !this.categoriesShown;
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

  changeCategory(event: Event) {
    const option = event.target as HTMLInputElement;
    const value = option.value;
    this.categoryFilter = value === 'All' ? null : value;
    this.applyFilters();
  }

  search() {
    if (this.searchResults.length == 1) {
      this.router.navigate(['/view/' + this.searchResults[0].name]);
    } else if (this.categoryFilter != 'all') {
      this.router.navigate(['/shop/' + this.categoryFilter]);
    } else {
      this.dataService.setShopFilter(this.searchStringFilter);
      this.router.navigate(['/shop']);
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
