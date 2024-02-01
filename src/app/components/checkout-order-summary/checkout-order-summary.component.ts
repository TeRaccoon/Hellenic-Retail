import { forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-checkout-order-summary',
  templateUrl: './checkout-order-summary.component.html',
  styleUrls: ['./checkout-order-summary.component.scss']
})
export class CheckoutOrderSummaryComponent {
  cartData: any;
  cartProducts: any[] = [];
  cartIDs: number[] = [];
  prices : number[] = [];
  total = 0;
  imageUrl = '';

  constructor(private cartService: CartService, private dataService: DataService, private formService: FormService) {}

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();

    this.loadData();

    this.cartService.getIDs().subscribe((ids) => {
      this.cartIDs = ids;
    });
  }

  async loadData() {
    await this.cartService.getCartItems().subscribe((products) => {
      this.cartData = products;
    });
    await this.loadCartData();
  }

  loadCartData() {
    const observables = this.cartIDs.map(id =>
      this.dataService.collectData('product-from-id', id.toString())
    );
    forkJoin(observables).pipe(
      tap((products: any[]) => {
        products.forEach((product, i) => {
          this.cartProducts.push(product);
          this.prices.push(product.retail_price * this.cartData[i].quantity);
          this.total += this.prices[i];
        });
      }),
      catchError(error => {
        console.error('Error in loadCartData:', error);
        throw error;
      })
    ).subscribe();
  }
}
