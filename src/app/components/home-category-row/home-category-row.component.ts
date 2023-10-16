import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-category-row',
  templateUrl: './home-category-row.component.html',
  styleUrls: ['./home-category-row.component.scss']
})
export class HomeCategoryRowComponent {
  categories: string[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }
  async loadData() {
    this.dataService.collectData("categories").subscribe((data: any) => {
      this.categories = data;
    });
  }
}
