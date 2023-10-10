import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent {
  products: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadProductGrid();
  }

  loadProductGrid() {
    let filter = localStorage.getItem("filter");

    if (filter !== null) {
      this.dataService.collectData("items-category", filter).subscribe((data: any) => {
        this.products = data;
        console.log(data);
      });
    } else {
      console.error('No "filter" found in localStorage.');
    }
  }
}
