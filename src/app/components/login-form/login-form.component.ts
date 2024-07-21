import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

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
  spinner = faCircleNotch;

  loginForm: FormGroup;
  loginVisible = 'visible';
  loginError: string = '';

  forgotPasswordState = false;
  loading = false;

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
    if (!this.authService.isLoggedIn()) {
      this.loginVisible = 'visible';
      this.reset();
    }
  }

  reset() {
    this.forgotPasswordState = false;
    this.submitted = false;
    this.loginError = '';
  }

  toggleLogin() {
    let state = this.loginVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'hidden') {
      this.formService.hideLoginForm();
    }
  }

  hideLogin() {
    this.loginVisible = 'hidden';
    this.formService.hideLoginForm();
  }

  inputHasError(field: string) {
    return this.loginForm.get(field)?.invalid && this.submitted;
  }

  async formSubmit() {
    this.submitted = true;
    if (!this.forgotPasswordState) {
      if (this.loginForm.valid) {
        this.loading = true;
        let loginResponse = await lastValueFrom(this.dataService.submitFormData(this.loginForm.value));
        if (loginResponse.success) {
          await this.authService.checkLogin();
          this.loginVisible = 'hidden';
          await this.tracing();
        } else {
          this.loginError = loginResponse.message;
        }
        this.loading = false;
      }
    } else {
      if (this.loginForm.valid) {
        if (await this.checkCustomerEmail()) {
          this.loading = true;
          let password = this.generatePassword();
          const emailHTML = this.dataService.generateForgotPasswordEmail(password);
          const emailData = {
            action: 'mail',
            mail_type: 'forgot_password',
            subject: 'Forgot Password Request',
            email_HTML: emailHTML,
            address: this.loginForm.get('email')?.value,
            name: 'Customer',
          };
          let response = await lastValueFrom(this.dataService.sendEmail(emailData));
          if (response.success) {
            this.changePassword(password);
            this.formService.setPopupMessage('A temporary password has been sent!', true, 10000);
          } else {
            this.loginError = 'There was a problem issuing a temporary password. Please try again or contact support for help: support@hellenicgrocery.co.uk';
          }
          this.loading = false;
        }
      }
    }
  }

  async changePassword(password: string) {
    let response = await lastValueFrom<any>(this.dataService.processPost({'action': 'change-password', 'email': this.loginForm.get('email')?.value, 'password': password}));
    if (response.success) {
      console.log('Password changed successfully');
    } else {
      this.formService.setPopupMessage('Password has been updated successfully', true, 10000);
    }
  }

  async checkCustomerEmail() {
    let email = this.loginForm.get('email')?.value;
    let response = await lastValueFrom(this.dataService.collectData('user-id-from-email', email));
    if (response.length == 0) {
      this.loginError = "A user doesn't exist with this email";
      return false;
    }
    return true;
  }

  async sendForgotPasswordEmail() {
    let emailHTML = this.dataService.generateForgotPasswordEmail(this.loginForm.get('email')?.value);
  }

  generatePassword() {
    let length = 10;
    let charset = 'abcdefghijklmnopqrstuvwxyz1234567890!,.#';
    let password = '';
    for (let i = 0, n = charset.length; i < length; i++) {
      password  += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  async tracing() {
    let customerId = this.authService.getUserID();
    await lastValueFrom(this.dataService.processPost({'action': 'tracing', 'page': 'login', 'customer_id': customerId}));
  }

  createAccount() {
    this.router.navigate(['/create-account']);
    this.formService.hideLoginForm();
  }

  forgotPassword() {
    if (this.forgotPasswordState) {
      this.loginForm.get('password')?.addValidators(Validators.required);
    } else {
      this.loginForm.get('password')?.removeValidators(Validators.required);
    }
    this.forgotPasswordState = !this.forgotPasswordState;
    console.log(this.loginForm);
  }
}
