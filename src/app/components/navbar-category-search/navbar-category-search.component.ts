import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { FilterService } from 'src/app/services/filter.service';
import { UrlService } from 'src/app/services/url.service';

@Component({
  selector: 'app-navbar-category-search',
  templateUrl: './navbar-category-search.component.html',
  styleUrls: ['./navbar-category-search.component.scss']
})
export class NavbarCategorySearchComponent {
  faBars = faBars;
  faSearch = faSearch;

  loginVisible = 'hidden';
  cartVisible = 'hidden';
  cartState: string = 'inactive';
  
  subcategories: any[] = [];
  categories: string[] = [];
  categoriesShown = false;
  products: any[] = [];

  searchResults: any[] = [];
  categoryFilter: string = 'all';
  searchStringFilter = "";
  imageUrl: string;

  constructor(private urlService: UrlService, private dataService: DataService, private filterService: FilterService, private router: Router) {
    this.imageUrl = this.urlService.getUrl('uploads');;
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

    let products: any = await this.dataService.collectDataComplex('products');
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

  changeCategory(event: Event) {
    this.categoryFilter = (event.target as HTMLInputElement).value;
    this.searchResults = this.filterService.applyCategoryFilter(this.categoryFilter, this.searchStringFilter, this.products);
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
