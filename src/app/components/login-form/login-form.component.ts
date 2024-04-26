import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  animations: [
    trigger('loginAnimation', [
      state('visible', style({ opacity: 1, display: 'block'})),
      state('hidden', style({ opacity: 0, display: 'none'})),
      transition('hidden => visible', animate('600ms ease', keyframes([
        style({opacity: 0, display: 'block', offset: 0}),
        style({opacity: 1, offset: 1})
      ]))),
      transition('visible => hidden', animate('600ms ease', keyframes([
        style({opacity: 1, offset: 0}),
        style({opacity: 0, display: 'none', offset: 1})
      ])))
    ]),
  ]
})
export class LoginFormComponent {
  loginForm: FormGroup;
  loginVisible = 'visible';
  loginError: string = '';

  submitted = false;

  errorMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' }
    ]
  };

  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private formService: FormService, private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      action: ['customer-login']
    });
  }

  ngOnInit() {
    this.formService.getLoginFormVisibility().subscribe((visible: any) => {
      this.loginVisible = visible ? 'visible' : 'hidden';
      if (visible) {
        this.showLogin();
      } else {
        this.loginVisible = 'hidden';
      }
    });
  }

  async showLogin() {
    await this.authService.checkLogin();
    if (!this.authService.isLoggedIn()) {
      this.loginVisible = 'visible';
    }
  }

  toggleLogin() {
    let state = this.loginVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'hidden') {
      this.formService.hideLoginForm();
    }
  }

  inputHasError(field: string) {
    return this.loginForm.get(field)?.invalid && this.submitted;
  }

  async formSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      let loginResponse = await lastValueFrom(this.dataService.submitFormData(this.loginForm.value));
      if (loginResponse.success) {
        this.authService.checkLogin();
        this.loginVisible = 'hidden';
      } else {
        this.loginError = loginResponse.message;
      }
    }
  }

  createAccount() {
    this.router.navigate(['/create-account']);
    this.formService.hideLoginForm();
  }
}
