import { Component } from '@angular/core';

@Component({
  selector: 'app-shop-sidebar',
  templateUrl: './shop-sidebar.component.html',
  styleUrls: ['./shop-sidebar.component.scss']
})
export class ShopSidebarComponent {
  prices = ["£0.01-£5.00", "£5.00-£10.00", "£10.00-£15.00", "£15.00+"];

  ngOnInit() {
    
  }
}
