import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { faCaretDown, faEnvelope, faSearch, faUser, faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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
  loginVisible = 'hidden';
  cartVisible = 'hidden';

  imageUrl = '';

  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private formService: FormService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.formService.getLoginFormVisibility().subscribe((visible) => {
      this.loginVisible = visible ? 'visible' : 'hidden';
    });
    this.loadNavBar();
  }

  async loadNavBar() {
    let categories = await lastValueFrom(this.dataService.collectData("categories"));
    if (categories != null) {
      this.categories = categories;
    }

    let subcategories = await lastValueFrom(this.dataService.collectData("subcategories"));
    if (subcategories != null) {
      this.subcategories = subcategories;
    }

    let products = await lastValueFrom(this.dataService.collectData("products"));
    if (products != null) {
      this.products = products;
      this.searchResults = products;

      this.oldPrices = this.products.map((product: any) => {
        if (product.discount && product.discount != null) {
          return product.price * ((100 - product.discount) / 100);
        } else {
          return null;
        }
      });
    }
  }

  changeCategory(event: Event) {
    const option = event.target as HTMLInputElement;
    let value = option.value;
    if (value == 'all') {
      this.searchResults = this.products;
    } else {
      this.searchResults = this.products.filter((product) => product.category.toLowerCase().includes(value.toLowerCase()));
    }
  }

  onInputFocus() {
    const dropdown = document.querySelector('.search-dropdown-items');
    if (dropdown) {
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

  showAccount() {
    this.authService.isLoggedIn().subscribe((data) => {
      if (data) {
        this.router.navigate(['/account']);
      }
      else {
        this.toggleLogin();
      }
    })
  }

  toggleLogin() {
    let state = this.loginVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'visible') {
      this.formService.showLoginForm();
    }
  }
  toggleCart() {
    let state = this.cartVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'visible') {
      this.formService.showCartForm();
    }
  }
}
