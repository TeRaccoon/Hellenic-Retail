import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faBars, faCartShopping, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-category-search',
  templateUrl: './navbar-category-search.component.html',
  styleUrls: ['./navbar-category-search.component.scss']
})
export class NavbarCategorySearchComponent {
  faBars = faBars;
  faUser = faUser;
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  
  categories: string[] = [];
  categoriesShown = false;

  loginVisible = 'hidden';
  cartVisible = 'hidden';
  cartState: string = 'inactive';

  constructor(private dataService: DataService, private authService: AuthService, private formService: FormService, private router: Router) { }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    this.dataService.collectData("categories").subscribe((data: any) => {
      this.categories = data;
    });
  }

  toggleCategory() {
    this.categoriesShown = !this.categoriesShown;
  }
  
  async showAccount() {
    let loginResponse = await lastValueFrom(this.authService.checkLogin());
    if (loginResponse.success) {
      this.router.navigate(['/account']);
    } else {
      this.toggleLogin();
    }
  }

  toggleLogin() {
    this.loginVisible == 'hidden' && this.formService.showLoginForm(); 
  }
  toggleCart() {
    this.cartVisible == 'hidden' && this.formService.showCartForm();
  }
}
