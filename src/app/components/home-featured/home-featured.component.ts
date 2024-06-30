import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faHeart, faEye, faBox, faPallet } from '@fortawesome/free-solid-svg-icons';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-featured',
  templateUrl: './home-featured.component.html',
  styleUrls: ['./home-featured.component.scss']
})
export class HomeFeaturedComponent {
  faHeart = faHeart;
  faEye = faEye;
  faBox = faBox;
  faPallet = faPallet;

  featuredProducts: any[] = [];
  featuredData: any;

  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) { }

  ngOnInit() {
    this.loadProducts();
    this.imageUrl = this.dataService.getUploadURL();
  }

  async loadProducts() {
    let featuredProducts = await lastValueFrom(this.dataService.collectDataComplex('featured', { limit: "3" }));
    this.featuredProducts = Array.isArray(featuredProducts) ? featuredProducts : [featuredProducts];
    
    this.featuredProducts.forEach((product) => {
      if (product.discount && product.discount != null) {
        product.discounted_price = product.price * ((100 - product.discount) / 100);
      }
    });

    this.featuredData = await lastValueFrom(this.dataService.collectData('section-data', 'home-featured'));
  }

  openImage(imageLocation: string) {
    this.formService.setImageViewerUrl(this.imageUrl + imageLocation);
    this.formService.showImageViewer();
  }

  async addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(productID, quantity);
    this.formService.showCartForm();
  }

  async addToWishlist(productID: number) {
    this.cartService.addToWishlist(productID);
  }
}
