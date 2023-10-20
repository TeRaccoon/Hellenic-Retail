import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['./shop-grid.component.scss']
})
export class ShopGridComponent {
  resultsAmount: any;
  products: any[] = [];

  constructor(private dataService: DataService, private router: Router) { }
  
  ngOnInit() {
    let url = this.router.url;
    let urlArray = url.split('/');
    let lastSegment = decodeURI(urlArray[urlArray.length - 1]);
    this.loadProducts(lastSegment);
  }

  async loadProducts(lastSegment: string) {
    this.dataService.collectData("products-from-category", lastSegment).subscribe((data: any) => {
      this.products = data;
    });
  }
}
