import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

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
    let topProducts = await lastValueFrom(this.dataService.collectData('top-products', '10'));
    this.topProducts = Array.isArray(topProducts) ? topProducts : [topProducts];
    
    this.oldPrices = this.topProducts.map((product: any) => {
      if (product.discount && product.discount != null) {
        return product.price * ((100 - product.discount) / 100);
      } else {
        return null;
      }
    });
  }

  openImage(imageLocation: string) {
    this.formService.setImageViewerUrl(this.imageUrl + imageLocation);
    this.formService.showImageViewer();
  }

  async addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(productID, quantity);
    this.formService.showCartForm();
  }
}
