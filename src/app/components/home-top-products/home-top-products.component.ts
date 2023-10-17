import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-top-products',
  templateUrl: './home-top-products.component.html',
  styleUrls: ['./home-top-products.component.scss']
})
export class HomeTopProductsComponent {
  topProducts: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.dataService.collectData('top-products', '10').subscribe((data: any) => {
      this.topProducts = data;
      this.calculateOffer();
    });
  }

  calculateOffer() {
    this.topProducts.forEach(product => {
      if (product.offer_id != null) {
        console.log(product.offer_id);
        switch (product.offer_id) {
          case 1:
            console.log("Also here");
            product.offer_id = product.price * 0.95;
            break;
        }
      }
    })
  }
}
