import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent {
  registrationForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  faCircleNotch = faCircleNotch;

  subscribe = false;
  agreedToTerms = false;

  constructor(private authService: AuthService, private mailService: MailService, private router: Router, private dataService: DataService, private formService: FormService, private formBuilder: FormBuilder, private accountService: AccountService) {
    this.registrationForm = this.formBuilder.group({
      forename: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.pattern(/^\+?\d{1,3}[- ]?\d{3,}$/)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', Validators.required],
      termsAndConditions: [false, Validators.required],
      promoConsent: [false, Validators.required],
      action: ['create-account'],
      table_name: ['customers']
    });
  }

  ngOnInit() {
    this.submitted = false;
    this.error = '';

    this.formService.setBannerMessage("Create Account");
  }

  passwordsMatch(): boolean {
    const password = this.registrationForm.get('password')?.value;
    const passwordRepeat = this.registrationForm.get('passwordRepeat')?.value;
    return password === passwordRepeat;
  }

  async onSubmit() {
    this.submitted = true;
    let response = await this.accountService.createAccount(this.registrationForm.value, this.registrationForm.valid);

    if (response.success) {
      this.formService.setPopupMessage(response.message, true, 3000);

      this.authService.checkLogin();
      setTimeout(() => {
        this.router.navigate(['/account']);
      }, 3000);
    } else {
      this.error = response.message;
    }
  }

  inputHasError(field: string) {
    return this.registrationForm.get(field)?.invalid && this.submitted;
  }

  onPromoCheckboxChange(event: any) {
    this.subscribe = event.target.checked;
  }

  onTermsCheckboxChange(event: any) {
    this.agreedToTerms = event.target.checked;
  }
}
