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
  setActive(selectedCategory: any, isSubcategory: boolean) {
    console.log(selectedCategory);
    if (isSubcategory) {

    } else {
          // Reset all categories to inactive
          this.categories.forEach(function(cat) {
            cat.active = false;
        });

        // Set the selected category to active
        selectedCategory.active = true;
    }
  }
  // showDropdown(selectedCategory: any) {
  //   // Hide all categories
  //   this.categories.forEach(function(cat) {
  //       cat.show = false;
  //   });

  //   // Show the selected category
  //   selectedCategory.show = true;
  // }
}
