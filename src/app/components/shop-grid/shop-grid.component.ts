import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss']
})
export class ShopGridComponent {
  faHeart = faHeart;
  faEye = faEye;
  
  resultsAmount: number | undefined;
  products: any[] = [];
  oldPrices: (number | null)[] = [];

  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private route: ActivatedRoute, private formService: FormService) { }
  
  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.route.params.subscribe(params => {
      const category = params['category'];
      this.loadProducts(category);
    });
  }

  async loadProducts(category:string) {
    this.dataService.collectData("products-from-category", category).subscribe((data: any) => {
      this.products = Array.isArray(data) ? data : [data];
      this.resultsAmount = data.length === undefined ? 1 : data.length;

      this.oldPrices = this.products.map((product: any) => {
        if (product.discount && product.discount != null) {
          return product.price * ((100 - product.discount) / 100);
        } else {
          return null;
        }
      });
    });
  }
  changeSorting(event: any) {
    const selectedOption = event.target.value;
    switch (selectedOption) {
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
}
