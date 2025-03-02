import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormService } from '../../services/form.service';
import { UrlService } from 'src/app/services/url.service';
import { faHeart, faEye, faFire } from '@fortawesome/free-solid-svg-icons';
import { CustomerType } from 'src/app/common/types/account';
import { CartUnit } from 'src/app/common/types/cart';
import { ProductBanner } from 'src/app/common/types/shop';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @Input() product: any;
  @Input() customerType: CustomerType = CustomerType.Retail;
  @Input() showSoldCount = true;

  imageUrl: string;
  unit: CartUnit = CartUnit.Unit;
  quantity: number = 1;

  stockBanner: ProductBanner = {
    message: '',
    class: ''
  };

  soldBanner: string = ''

  faHeart = faHeart;
  faEye = faEye;
  fire = faFire

  constructor(
    private urlService: UrlService,
    private cartService: CartService,
    private formService: FormService
  ) {
    this.imageUrl = this.urlService.getUrl('uploads');
  }

  ngOnInit() {
    this.product.adjusted_quantity = this.product.quantity;
    this.setProductBanner();
    this.showSoldCount && this.setSoldBanner();
  }

  setProductBanner() {
    if (this.product.discount && this.product.discount != null) {
      this.product.discounted_price =
        this.product.price * ((100 - this.product.discount) / 100);
    }

    if (this.product.quantity > 10) {
      this.stockBanner.message = ''
      this.stockBanner.class = '';
    } else if (this.product.quantity > 0) {
      this.stockBanner.message = 'Low on stock!';
      this.stockBanner.class = 'low-stock';
    } else {
      this.product.quantity = 0;
      this.stockBanner.message = 'Out of stock!';
      this.stockBanner.class = 'out-of-stock';
    }
  }

  setSoldBanner() {
    if (this.product.quantity != 0) {
      let number = Math.floor(Math.random() * 10);
      if (number == 1) {
        number = Math.floor(Math.random() * 15) + 3
        this.soldBanner = `${number} sold in the last hour`;
      }
    }
  }

  openImage(imageLocation: string) {
    this.formService.setImageViewerUrl(this.imageUrl + imageLocation);
    this.formService.showImageViewer();
  }

  async addToCart(productID: number) {
    this.cartService.addToCart(productID, this.quantity, this.unit);
  }

  async addToWishlist(productID: number) {
    this.cartService.addToWishlist(productID);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }

  changePackageType(event: any) {
    this.unit = event.target.value;
    if (this.product) {
      this.product.adjusted_quantity = Math.trunc(
        this.product.quantity /
        this.cartService.getQuantityMultiplier(this.product, this.unit)
      );
    }

    if (this.quantity > this.product.adjusted_quantity) {
      this.quantity = this.product.adjusted_quantity;
    }
  }
}
