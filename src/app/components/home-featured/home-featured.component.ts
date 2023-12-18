import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-featured',
  templateUrl: './home-featured.component.html',
  styleUrls: ['./home-featured.component.scss']
})
export class HomeFeaturedComponent {
  faHeart = faHeart;
  faEye = faEye;
  
  featuredProducts: any[] = [];
  oldPrices: (number | null)[] = [];
  featuredData: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadOffers();
  }

  async loadOffers() {
    this.dataService.collectData('featured', '4').subscribe((data: any) => {
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

  openImage(imageLocation: string) {
    window.open('assets/uploads/admin_uploads/' + imageLocation, '_blank');
  } 
}
