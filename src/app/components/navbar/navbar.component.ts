import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  categories: any[] = [];
  subcategories: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadNavBar();
  }

  showCart() {
    // Add your logic for showing the cart here
    console.log('Cart button clicked');
  }

  showLogin() {
    // Add your logic for showing the login form here
    console.log('Login button clicked');
  }

  async loadNavBar() {
    this.dataService.collectData("categories").subscribe((data: any) => {
      this.categories = data;
    });
    this.dataService.collectData("subcategories").subscribe((data: any) => {
      this.subcategories = data;
    });
  }

  selectCategory(query: string, filter: string) {
    localStorage.setItem("query", query);
    localStorage.setItem("filter", filter);
  }
}
