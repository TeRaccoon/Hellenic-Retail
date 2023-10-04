import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  faCaretDown = faCaretDown;

  categories: any[] = [];
  subcategories: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadCategoryList();
  }
  async loadCategoryList() {
    this.dataService.collectData("categories").subscribe((data: any) => {
      this.categories = data;
    });
    this.dataService.collectData("subcategories").subscribe((data: any) => {
      this.subcategories = data;
    });
  }

  changeCategory(category: string, categoryType: string) {
    
  }
}
