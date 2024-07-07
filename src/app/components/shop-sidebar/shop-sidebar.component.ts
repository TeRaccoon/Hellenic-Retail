import { Component } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { RenderService } from 'src/app/services/render.service';

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
  screenSize : any = {}

  constructor(private filterService: FilterService, private renderService: RenderService ) { }

  ngOnInit() {
    this.renderService.getScreenSize().subscribe(size => {
      this.screenSize = size;
    });
  }

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
