import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormService } from '../../services/form.service';
import { UrlService } from 'src/app/services/url.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
import { CustomerType } from 'src/app/common/types/account';
import { CartUnit } from 'src/app/common/types/cart';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @Input() product: any;
  @Input() customerType: CustomerType = CustomerType.Retail;

  imageUrl: string;
  unit: CartUnit = CartUnit.Unit;
  quantity: number = 1;

  faHeart = faHeart;
  faEye = faEye;

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
  }

  setProductBanner() {
    if (this.product.discount && this.product.discount != null) {
      this.product.discounted_price =
        this.product.price * ((100 - this.product.discount) / 100);
    }
    if (
      this.product.quantity === null ||
      this.product.quantity === 0 ||
      this.product.quantity === undefined
    ) {
      this.product.quantity = 0;
      this.product.banner = 'Out of stock!';
    } else if (this.product.quantity < 10) {
      this.product.banner = 'Low on stock!';
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
