import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  loginError:string = '';

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

  constructor(private router: Router, private dataService: DataService, private formService: FormService, private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.formService.getLoginFormVisibility().subscribe((visible) => {
      this.loginVisible = visible ? 'visible' : 'hidden';
    });
  }

  toggleLogin() {
    let state = this.loginVisible == 'visible' ? 'hidden' : 'visible';
    if (state == 'hidden') {
      this.formService.hideLoginForm();
    }
  }

  formSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.dataService.submitFormData('login', this.loginForm.value).subscribe((data: any) => {
        if (data == 'true') {
          
        }
        else {
          this.loginError = data;
        }
      });
    }
  }
}
