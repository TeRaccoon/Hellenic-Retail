import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar-category-search',
  templateUrl: './navbar-category-search.component.html',
  styleUrls: ['./navbar-category-search.component.scss']
})
export class NavbarCategorySearchComponent {
  faBars = faBars;
  categories: string[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    this.dataService.collectData("categories").subscribe((data: any) => {
      this.categories = data;
    });
  }
}
