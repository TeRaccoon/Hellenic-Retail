import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from 'src/app/services/form.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
import { FilterService } from 'src/app/services/filter.service';
import { RenderService } from 'src/app/services/render.service';
import { AuthService } from 'src/app/services/auth.service';
import { UrlService } from 'src/app/services/url.service';
import { CustomerType } from 'src/app/common/types/account';
import { take } from 'rxjs';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss'],
})
export class ShopGridComponent {
  screenSize: any = {};

  faHeart = faHeart;
  faEye = faEye;

  customerType: CustomerType = CustomerType.Retail;

  resultsAmount = 0;
  products: any[] = [];
  filteredProducts: any[] = [];
  oldPrices: (number | null)[] = [];
  messageSet = false;

  priceFilters: any = {};
  maxPrice: number | null = null;
  minPrice: number | null = null;

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  pageRange = [1];

  imageUrl = '';

  category: any = undefined;
  filter: any = null;
  filterHeader = 'Showing all results';

  constructor(
    private urlService: UrlService,
    private filterService: FilterService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private formService: FormService,
    private renderService: RenderService,
    private authService: AuthService
  ) {
    this.customerType = authService.getCustomerType();
  }

  ngOnInit() {
    this.products = [];
    this.imageUrl = this.urlService.getUrl('uploads');
    this.formService.setBannerMessage('Showing results');
    this.priceFilters = this.filterService.getShopPriceFilter();
    this.renderService.getScreenSize().subscribe((size) => {
      this.screenSize = size;
    });
    this.getShopFilter();
    this.authService.isLoggedInObservable;
  }

  getShopFilter() {
    this.route.params.subscribe((params) => {
      const category = params['category'];
      this.category = category;

      this.loadShop(category);
    });

    this.dataService.getShopFilter().subscribe((filter) => {
      this.filter = filter;
      if (filter != null) {
        let category = this.route.snapshot.params['category'];
        this.loadShop(category);
      }
    });

    this.filterService.getFilterUpdated().subscribe((updated) => {
      if (updated) {
        this.filterUpdated();
      }
    });
  }

  loadShop(categoryFilter: string | undefined) {
    let messageBase = 'Showing results for: ';
    let stringFilter = null;

    this.dataService
      .getShopFilter()
      .pipe(take(1))
      .subscribe((value) => {
        stringFilter = value;
      });

    if (
      (stringFilter !== null && stringFilter !== '') ||
      categoryFilter !== undefined
    ) {
      if (categoryFilter === undefined) {
        this.formService.setBannerMessage(`${messageBase}${stringFilter}`);
        this.filterHeader = `Search results: ${stringFilter}`;
      } else {
        this.formService.setBannerMessage(`${messageBase}${categoryFilter}`);
        this.filterHeader = categoryFilter;
      }

      this.loadProducts(categoryFilter, stringFilter);
    } else {
      this.formService.setBannerMessage('Showing results');
      this.filterHeader = 'Showing all results';
      this.loadProducts(undefined, null);
    }
  }

  filterUpdated() {
    this.maxPrice = this.filterService.getMaxPrice();
    this.minPrice = this.filterService.getMinPrice();
    this.filterService.filterUpdateReceived();
    this.filteredProducts = this.products.filter((p) => this.isInPriceRange(p));
    this.currentPage = 1;
    this.getPageRange();
  }

  async loadProducts(category: string | undefined, filter: string | null) {
    let products = [];
    if (
      (category !== undefined && this.category !== undefined) ||
      category == 'All'
    ) {
      products = await this.dataService.processGet(
        'products-from-category',
        { category: category },
        true,
        true
      );
    } else {
      products = await this.dataService.processGet('products', {}, true, true);
    }

    if (filter != null) {
      products = this.filterByString(filter, products);
    }

    products.forEach((product: any) => {
      if (product.discount && product.discount != null) {
        product.discounted_price =
          product.price * ((100 - product.discount) / 100);
      }
    });

    this.products = products;
    this.filteredProducts = products;

    this.getPageRange();
  }

  filterByString(filter: string, products: any[]) {
    return products.filter((product) =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  changeSorting(event: any) {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case 'default':
        this.products.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        break;

      case 'high-low':
        this.filteredProducts.sort((a, b) => {
          const priceA =
            a.discounted_price != null ? a.discounted_price : a.price;
          const priceB =
            b.discounted_price != null ? b.discounted_price : b.price;
          return priceB - priceA;
        });
        break;

      case 'low-high':
        this.filteredProducts.sort((a, b) => {
          const priceA =
            a.discounted_price != null ? a.discounted_price : a.price;
          const priceB =
            b.discounted_price != null ? b.discounted_price : b.price;
          return priceA - priceB;
        });
        break;

      default:
        this.filterService.setMaxPrice(selectedOption.maxPrice);
        this.filterService.setMinPrice(selectedOption.minPrice);
        this.filterService.filterUpdateRequested();
        break;
    }
  }

  changeItemsPerPage(event: any) {
    this.itemsPerPage = event.target.value;
    this.getPageRange();
  }

  calculatePages() {
    this.resultsAmount =
      this.products.length === undefined ? 1 : this.filteredProducts.length;
    this.totalPages = Math.floor(this.resultsAmount / this.itemsPerPage + 1);
  }

  getPageRange() {
    this.calculatePages();

    const range = [];
    let start = this.currentPage;

    if (this.currentPage > this.totalPages) {
      start = this.totalPages;
    } else if (this.currentPage < 1) {
      start = 1;
    }

    if (this.totalPages <= 3) {
      for (let i = 1; i <= this.totalPages; i++) {
        range.push(i);
      }
    } else {
      const lowerBound = Math.max(1, start - 1);
      const upperBound = Math.min(this.totalPages, start + 1);

      for (let i = lowerBound; i <= upperBound; i++) {
        range.push(i);
      }

      if (!range.includes(this.totalPages)) {
        range.push(this.totalPages);
      }
    }

    this.pageRange = range;
  }

  isInPriceRange(product: any) {
    const priceToCheck =
      product.discounted_price != null
        ? product.discounted_price
        : product.price;

    if (this.maxPrice != null && this.minPrice != null) {
      return priceToCheck >= this.minPrice && priceToCheck <= this.maxPrice;
    }
    return true;
  }
}
