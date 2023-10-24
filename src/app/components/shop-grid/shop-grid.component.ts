import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss']
})
export class ShopGridComponent {
  resultsAmount: number | undefined;
  products: any[] = [];
  oldPrices: (number | null)[] = [];

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      // const category = params['category'];
      // this.loadProducts(category);
      console.log(params);
    });
  }

  async loadProducts(category:string) {
    this.dataService.collectData("products-from-category", category).subscribe((data: any) => {
      this.products = Array.isArray(data) ? data : [data];
      this.resultsAmount = data.length === undefined ? 1 : data.length;

      this.oldPrices = this.products.map((product: any) => {
        if (product.discount && product.discount != null) {
          return product.price * ((100 - product.discount) / 100);
        } else {
          return null;
        }
      });
    });
  }
  changeSorting(event: any) {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case "high-low":
        this.products.sort((a, b) => b.price - a.price);
        break;

      case "low-high":
        this.products.sort((a, b) => a.price - b.price);
        break;
    }
  }
}
