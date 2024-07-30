import { Component, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { FormService } from '../../services/form.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product: any;

  imageUrl: string;

  faHeart = faHeart;
  faEye = faEye;

  constructor(
    private cartService: CartService,
    private formService: FormService,
    private dataService: DataService,
  ) {
    this.imageUrl = this.dataService.getUploadURL();
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
