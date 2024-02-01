import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-top-products',
  templateUrl: './home-top-products.component.html',
  styleUrls: ['./home-top-products.component.scss']
})
export class HomeTopProductsComponent {
  faHeart = faHeart;
  faEye = faEye;

  topProducts: any[] = [];
  oldPrices: (number | null)[] = [];

  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadProducts();
  }

  async loadProducts() {
    this.dataService.collectData('top-products', '10').subscribe((data: any) => {
      this.topProducts = data;
      this.oldPrices = this.topProducts.map((product: any) => {
        if (product.discount && product.discount != null) {
          return product.price * ((100 - product.discount) / 100);
        } else {
          return null;
        }
      });
    });
  }

  openImage(imageLocation: string) {
    window.open(this.imageUrl + imageLocation, '_blank');
  }

  async addToCart(productID: number, quantity: number) {
    await this.cartService.addToCart(productID, quantity);
    await this.formService.showCartForm();
  }
}
