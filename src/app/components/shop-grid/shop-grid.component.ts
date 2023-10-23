import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss']
})
export class ShopGridComponent {
  resultsAmount: any;
  products: any[] = [];
  oldPrices: any[] = [];

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      const category = params['category'];
      this.loadProducts(category);
    });
  }

  async loadProducts(category:string) {
    this.dataService.collectData("products-from-category", category).subscribe((data: any) => {
      this.products = data;
      this.resultsAmount = data.length === undefined ? 1 : data.length;
      data.forEach((product: any) => {
        if (product.discount && product.discount != null) {
          this.oldPrices.push(product.price * ((100 - product.discount) / 100));
        } else {
          this.oldPrices.push(null);
        }
      });
      console.log(this.oldPrices);
    });
  }
}
