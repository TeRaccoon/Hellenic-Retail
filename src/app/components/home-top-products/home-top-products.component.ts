import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { UrlService } from 'src/app/services/url.service';
import {
  faHeart,
  faEye,
  faBox,
  faPallet,
} from '@fortawesome/free-solid-svg-icons';
import { RenderService } from 'src/app/services/render.service';
import { CustomerType } from 'src/app/common/types/account';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-top-products',
  templateUrl: './home-top-products.component.html',
  styleUrls: ['./home-top-products.component.scss'],
})
export class HomeTopProductsComponent {
  screenSize: any = {};
  limit = 10;

  customerType: CustomerType = CustomerType.Retail;

  faHeart = faHeart;
  faEye = faEye;
  faBox = faBox;
  faPallet = faPallet;

  topProducts: any[] = [];
  oldPrices: (number | null)[] = [];

  imageUrl = '';

  constructor(
    private urlService: UrlService,
    private cartService: CartService,
    private dataService: DataService,
    private formService: FormService,
    private renderService: RenderService,
    private authService: AuthService
  ) {
    this.customerType = this.authService.getCustomerType();
  }

  ngOnInit() {
    this.imageUrl = this.urlService.getUrl('uploads');
    this.loadProducts();
    this.renderService.getScreenSize().subscribe((size) => {
      this.screenSize = size;
      this.limit = this.screenSize.width < 1080 ? 6 : 10;
    });
  }

  async loadProducts() {
    this.topProducts = await this.dataService.processGet(
      'top-products',
      { limit: this.limit },
      true,
      true
    );
  }

  openImage(imageLocation: string) {
    this.formService.setImageViewerUrl(this.imageUrl + imageLocation);
    this.formService.showImageViewer();
  }

  async addToCart(productID: number, quantity: number) {
    this.cartService.addToCart(productID, quantity);
  }

  addToWishlist(productID: number) {
    this.cartService.addToWishlist(productID);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
