import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faCaretDown, faEnvelope, faSearch, faUser, faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  faCaretDown = faCaretDown;
  faEnvelope = faEnvelope;
  faSearch = faSearch;
  faUser = faUser;
  faHeart = faHeart;
  faCartShopping = faCartShopping;

  categories: string[] = [];
  subcategories: any[] = [];
  products: any[] = [];
  searchResults: any[] = [];
  oldPrices: (number | null)[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadNavBar();
  }

  showCart() {
    console.log('Cart button clicked');
  }

  showLogin() {
    console.log('Login button clicked');
  }

  async loadNavBar() {
    this.dataService.collectData("categories").subscribe((data: any) => {
      this.categories = data;
    });
    this.dataService.collectData("subcategories").subscribe((data: any) => {
      this.subcategories = data;
    });
    this.dataService.collectData("products").subscribe((data: any) => {
      this.products = data;
      this.searchResults = data;
      
      this.oldPrices = this.products.map((product: any) => {
        if (product.discount && product.discount != null) {
          return product.price * ((100 - product.discount) / 100);
        } else {
          return null;
        }
      });
    });
  }

  selectCategory(query: string, filter: string) {
    localStorage.setItem("query", query);
    localStorage.setItem("filter", filter);
  }

  onInputFocus() {
    const dropdown = document.querySelector('.search-dropdown-items');
    if (dropdown) {
      console.log("applied");
      dropdown.classList.add('focused');
    }
  }
  
  onInputBlur() {
    const dropdown = document.querySelector('.search-dropdown-items');
    if (dropdown) {
      dropdown.classList.remove('focused');
    }
  }

  search(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;
    this.searchResults = this.products.filter((product) => product.name.toLowerCase().includes(inputValue.toLowerCase()));
  }
}
