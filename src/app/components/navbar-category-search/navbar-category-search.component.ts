import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';
import { UrlService } from 'src/app/services/url.service';
import { CacheService } from 'src/app/services/cache.service';
import { Category, SubCategory } from 'src/app/common/types/cache';

@Component({
  selector: 'app-navbar-category-search',
  templateUrl: './navbar-category-search.component.html',
  styleUrls: ['./navbar-category-search.component.scss'],
})
export class NavbarCategorySearchComponent {
  @ViewChild('categorySearch') categorySearch!: ElementRef;

  faBars = faBars;
  faSearch = faSearch;

  loginVisible = 'hidden';
  cartVisible = 'hidden';
  cartState: string = 'inactive';

  categories: Category[] = [];
  categoryGroups: {
    category: string;
    subcategories: string[];
  }[] = [];

  categoriesShown = false;
  products: any[] = [];

  searchResults: any[] = [];
  categoryFilter: string = 'all';
  searchStringFilter = '';
  imageUrl: string;

  constructor(
    private renderer: Renderer2,
    private urlService: UrlService,
    private dataService: DataService,
    private filterService: FilterService,
    private cacheService: CacheService,
    private router: Router
  ) {
    const handleEvent = (e: Event) => {
      const categorySearchClick = this.categorySearch?.nativeElement.contains(
        e.target
      );

      if (!categorySearchClick) {
        this.categoriesShown = false;
      }
    };

    this.renderer.listen('window', 'mousedown', handleEvent);
    this.renderer.listen('window', 'touchstart', handleEvent);

    this.imageUrl = this.urlService.getUrl('uploads');
  }

  ngOnInit() {
    this.loadNavBar();
  }

  async loadCategories() {
    this.categories = await this.cacheService.getCategories();
    let subCategories: SubCategory[] =
      await this.cacheService.getSubCategories();

    this.categories.forEach((category) => {
      this.categoryGroups.push({
        category: category.name,
        subcategories: subCategories
          .filter((s) => s.category_id == category.id)
          .map((s) => s.name),
      });
    });
  }

  async loadNavBar() {
    await this.loadCategories();

    let products: any = await this.dataService.processGet(
      'products',
      {},
      true,
      false
    );

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
    this.router.navigate(['/shop/' + category]);
  }

  toggleCategory() {
    this.categoriesShown = !this.categoriesShown;
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

  changeCategory(event: Event) {
    this.categoryFilter = (event.target as HTMLInputElement).value;
    this.searchResults = this.filterService.applyCategoryFilter(
      this.categoryFilter,
      this.searchStringFilter,
      this.products
    );
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

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
