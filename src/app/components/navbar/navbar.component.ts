import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faCaretDown, faBars, faEnvelope, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  faCaretDown = faCaretDown;
  faBars = faBars;
  faEnvelope = faEnvelope;
  faSearch = faSearch;

  categories: string[] = [];
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
    console.log(filter);
    localStorage.setItem("filter", filter);
  }
}
