import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loginChecked = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loginChecked = false;
    this.checkLogin();
  }

  async checkLogin() {
    await this.authService.checkLogin();
    this.loginChecked = true;
  }
}
