import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss']
})
export class ShopGridComponent {
  faHeart = faHeart;
  faEye = faEye;
  
  resultsAmount = 0;
  products: any[] = [];
  oldPrices: (number | null)[] = [];
  messageSet = false;
  
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;

  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private route: ActivatedRoute, private formService: FormService) { }
  
  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.formService.setBannerMessage('Showing results')
    this.getShopFilter();
  }

  getShopFilter() {
    this.route.params.subscribe(params => {
      const category = params['category'];
      if (category !== undefined) {
        this.formService.setBannerMessage(`Showing results for: ${category}`);
      }
      this.loadProducts(category, null);
    });
    this.dataService.getShopFilter().subscribe(filter => {
      if (filter !== null) {
        this.formService.setBannerMessage(`Showing results for: ${filter}`);
      }
      this.loadProducts(undefined, filter)
    });
  }

  async loadProducts(category: string | undefined, filter: string | null) {
    let products = [];
    if (category !== undefined) {
      products = await lastValueFrom(this.dataService.collectData("products-from-category", category));
    } else {
      products = await lastValueFrom(this.dataService.collectData("products"));
    }
    products = Array.isArray(products) ? products : [products];
    if (filter != null) {
      products = this.filterByString(filter, products);
    }

    this.resultsAmount = products.length === undefined ? 1 : products.length;
    this.totalPages = Math.round(this.resultsAmount / this.itemsPerPage + 1);

    this.oldPrices = this.products.map((product: any) => {
      if (product.discount && product.discount != null) {
        return product.price * ((100 - product.discount) / 100);
      } else {
        return null;
      }
    });

    this.products = products;
  }

  filterByString(filter: string, products: any[]) {
    return products.filter((product) => product.name.toLowerCase().includes(filter.toLowerCase()));
  }
  
  changeSorting(event: any) {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case "default":
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
        
      case "high-low":
        this.products.sort((a, b) => b.price - a.price);
        break;

      case "low-high":
        this.products.sort((a, b) => a.price - b.price);
        break;
    }
  }

  openImage(imageLocation: string) {
    window.open(this.imageUrl + imageLocation, '_blank');
  }

  async addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(productID, quantity);
    this.formService.showCartForm();
  }

  async addToWishlist(productID: number) {
    this.cartService.addToWishlist(productID);    
    let customerID = await lastValueFrom(this.dataService.collectData("user-id-from-email"));
    let form = {
      action: "add",
      retail_item_id: productID,
      customer_id: customerID
    };
    this.dataService.submitFormData(form);
  }

  changeItemsPerPage(event: any) {
    this.itemsPerPage = event.target.value;
    this.totalPages = Math.trunc(this.resultsAmount / this.itemsPerPage + 1);
  }

  getPageRange(): number[] {
    const range = [];
    var start = this.currentPage;
    
    if (this.currentPage > this.totalPages -2 && this.totalPages -2 > 0) {
      start = this.totalPages - 2;
    }
    if (start == 1 && this.totalPages > 1) {
      start += 2;
    }
    else if (start == 2 && this.totalPages > 1) {
      start += 1;
    }
    for (let i = start - 1; i < start + 2 && i < this.totalPages && this.totalPages > 1; i++) {
      range.push(i);
    }

    if (this.totalPages > 1) {
      range.push(this.totalPages);
    }

    return range;
  }
}
