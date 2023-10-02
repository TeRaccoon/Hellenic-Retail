import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor() { }

  showCart() {
    // Add your logic for showing the cart here
    console.log('Cart button clicked');
  }

  showLogin() {
    // Add your logic for showing the login form here
    console.log('Login button clicked');
  }
}
