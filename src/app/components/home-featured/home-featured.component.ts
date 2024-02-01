import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-featured',
  templateUrl: './home-featured.component.html',
  styleUrls: ['./home-featured.component.scss']
})
export class HomeFeaturedComponent {
  featuredProducts: any[] = [];
  oldPrices: (number | null)[] = [];
  featuredData: any;

  imageUrl = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadOffers();
    this.imageUrl = this.dataService.getUploadURL();
  }

  async loadOffers() {
    this.dataService.collectData('featured', '3').subscribe((data: any) => {
      this.featuredProducts = data;
      this.oldPrices = this.featuredProducts.map((product: any) => {
        if (product.discount && product.discount != null) {
          console.log(product.discount);
          return product.price * ((100 - product.discount) / 100);
        } else {
          return null;
        }
      });
    });
    this.dataService.collectData('section-data', 'home-featured').subscribe((data: any) => {
      this.featuredData = data;
    });
  } 
}
