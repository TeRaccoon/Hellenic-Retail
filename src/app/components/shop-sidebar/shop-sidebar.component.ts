import { Component } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-shop-sidebar',
  templateUrl: './shop-sidebar.component.html',
  styleUrls: ['./shop-sidebar.component.scss']
})
export class ShopSidebarComponent {
  prices = ["£0.01-£5.00", "£5.00-£10.00", "£10.00-£15.00", "£15.00+"];
  maxPrices = [5, 10, 15, 999];
  minPrices = [0.01, 5, 10, 15]
  priceFilterIndex : number = -1;

  constructor(private filterService: FilterService) { }

  selectFilter(index: number) {
    this.priceFilterIndex = index;
    this.filterService.setMaxPrice(this.maxPrices[index]);
    this.filterService.setMinPrice(this.minPrices[index]);
    this.filterService.filterUpdateRequested();
  }

  clearFilter() {
    this.priceFilterIndex = -1;
    this.filterService.setMaxPrice(null);
    this.filterService.setMinPrice(null);
    this.filterService.filterUpdateRequested();
  }
}
