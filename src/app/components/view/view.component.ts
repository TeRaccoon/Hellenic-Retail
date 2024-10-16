import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetails } from 'src/app/common/types/shop';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  product: ProductDetails | null = null;
  outOfStock: boolean = true;
  stock = 1;

  userType: string | null = 'Retail';
  
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productName = params['productName'];
      this.loadProduct(productName);
    });
  }

  async loadProduct(productName: string) {
    await this.authService.checkLogin();
    this.userType = this.authService.getUserType();

    let product: ProductDetails = await this.dataService.processGet(
      'product-view-details',
      { productName: productName },
      false
    );

    if (product.discount && product.discount != null) {
      product.discounted_price =
        product.price * ((100 - product.discount) / 100);
      if (product.box_price != null && product.pallet_price) {
        product.discounted_box_price =
          product.box_price * ((100 - product.discount) / 100);
        product.discounted_pallet_price =
          product.pallet_price * ((100 - product.discount) / 100);
      }
    }

    this.product = product;

    let stock = await this.dataService.processGet('total-stock-by-id', {
      filter: product.id,
    });
    this.stock = stock.quantity;
    this.outOfStock = stock.quantity < 1;
  }
}
