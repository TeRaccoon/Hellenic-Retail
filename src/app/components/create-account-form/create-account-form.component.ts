import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
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

  constructor(private authService: AuthService, private mailService: MailService, private router: Router, private dataService: DataService, private formService: FormService, private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      forename: ['', Validators.required],
      surname: ['', Validators.required],
      phone_number_primary: ['', [Validators.required, Validators.pattern(/^\+?\d{1,3}[- ]?\d{3,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', Validators.required],
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

  onSubmit() {
    this.submitted = true;
    let passwordsMatch = this.passwordsMatch()
    if (this.registrationForm.valid && passwordsMatch) {
      this.submitForm();
    } else {
      if (!passwordsMatch) {
        this.error = "Your passwords do not match!";
      } else {
        this.error = "Please fill in the required fields!"
      }
    }
  }

  async submitForm() {
    if (this.registrationForm.valid) {
      if (this.agreedToTerms) {
        const formData = { ...this.registrationForm.value };
        delete formData.passwordRepeat;
    
        this.loading = true;

        let passed = await this.preSubmissionChecks();
        if (passed) {
          let response = await lastValueFrom(this.dataService.submitFormData(formData));
          if (response.success) {
            response = await this.sendAccountCreationEmail();
            if (response) {
              this.formService.setPopupMessage("Account Created Successfully!");
              this.subscribe && await this.subscribeToNewsletter();
              this.authService.checkLogin();
              setTimeout(() => {
                this.router.navigate(['/account']);
              }, 3000);
            }
            this.formService.showPopup();
          } else {
            this.error = "There was an issue creating your account. Please double check your details!";
          }
        }
        this.loading = false;
      } else {
        this.error = "Please agree to the terms and conditions!";
      }
    }
  }

  async sendAccountCreationEmail() {
    const emailHTML = this.mailService.generateAccountCreationEmail(this.registrationForm.value);
    const emailData = {
      action: 'mail',
      mail_type: 'account_creation',
      subject: 'Welcome to Hellenic Grocery',
      email_HTML: emailHTML,
      address: this.registrationForm.get('email')?.value,
      name: 'Customer',
    };

    let response = await this.mailService.sendEmail(emailData);
    if (!response.success) {
      this.formService.setPopupMessage('There was an issue sending you account creation confirmation email. Please contact support for help: support@hellenicgrocery.co.uk');
    }

    return response.success;
  }

  async subscribeToNewsletter() {
    const formData = {
      email: this.registrationForm.get('email')!.value,
      action: 'add',
      table_name: 'mailing_list',
    };
    let response = await lastValueFrom(this.dataService.submitFormData(formData));
    
    if (!response.success) {
      this.formService.setPopupMessage("There was an issue subscribing you to the newsletter!");
    }
  }

  async preSubmissionChecks() {
    let userIDs = await this.dataService.processGet("user-id-from-email", {filter: this.registrationForm.get('email')?.value});
    if (userIDs.length === 0) {
      return true;
    } else {
      this.error = "This email address has already been registered!";
    }
    return false;
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
