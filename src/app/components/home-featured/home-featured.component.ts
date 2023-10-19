import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-featured',
  templateUrl: './home-featured.component.html',
  styleUrls: ['./home-featured.component.scss']
})
export class HomeFeaturedComponent {
  featuredProducts: any[] = [];
  featuredData: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadOffers();
  }

  async loadOffers() {
    this.dataService.collectData('featured', '3').subscribe((data: any) => {
      this.featuredProducts = data;
    });
    this.dataService.collectData('section-data', 'home-featured').subscribe((data: any) => {
      this.featuredData = data;
    });
  } 
}
