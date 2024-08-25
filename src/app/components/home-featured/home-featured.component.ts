import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faHeart, faEye, faBox, faPallet } from '@fortawesome/free-solid-svg-icons';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { RenderService } from 'src/app/services/render.service';
import { UrlService } from 'src/app/services/url.service';

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

  screenSize: any = {};
  limit = 3;

  constructor(private urlService: UrlService, private cartService: CartService, private dataService: DataService, private formService: FormService, private renderService: RenderService) { }

  ngOnInit() {
    this.loadProducts();
    this.imageUrl = this.urlService.getUrl('uploads');;
    this.loadRenderService();
  }

  loadRenderService() {
    this.renderService.getScreenSize().subscribe(size => {
      this.screenSize = size;
      if (size.width < 500 && this.limit != 4) {
        this.limit = 4;
        this.loadProducts();
      } else if (size.width >= 500 && this.limit != 3) {
        this.limit = 3;
        this.loadProducts();
      }
    });
  }

  async loadProducts() {
    this.featuredProducts = await this.dataService.processGet('featured', { limit: this.limit }, true, true);
    
    this.featuredProducts.forEach((product) => {
      if (product.discount && product.discount != null) {
        product.discounted_price = product.price * ((100 - product.discount) / 100);
      }
      if (product.quantity === null || product.quantity === 0 || product.quantity === undefined) {
        product.quantity = 0;
        product.banner = 'Out of stock!';
      } else if (product.quantity < 10) {
        product.banner = 'Low on stock!';
      }
    });

    this.featuredData = await this.dataService.processGet('section-data', {filter: 'home-featured'});
  }

  openImage(imageLocation: string) {
    this.formService.setImageViewerUrl(this.imageUrl + imageLocation);
    this.formService.showImageViewer();
  }

  async addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(productID, quantity);
  }

  async addToWishlist(productID: number) {
    this.cartService.addToWishlist(productID);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
