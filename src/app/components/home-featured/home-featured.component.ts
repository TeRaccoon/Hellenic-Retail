import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
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

  featuredProducts: any[] = [];
  oldPrices: (number | null)[] = [];
  featuredData: any;

  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) { }

  ngOnInit() {
    this.loadOffers();
    this.imageUrl = this.dataService.getUploadURL();
  }

  async loadOffers() {
    let featuredProducts = await lastValueFrom(this.dataService.collectData('featured', '3'));
    this.featuredProducts = Array.isArray(featuredProducts) ? featuredProducts : [featuredProducts];

    this.oldPrices = this.featuredProducts.map((product: any) => {
      if (product.discount && product.discount != null) {
        return product.price * ((100 - product.discount) / 100);
      } else {
        return null;
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
}
