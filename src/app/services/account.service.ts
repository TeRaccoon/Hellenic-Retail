import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormService } from './form.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MailService } from './mail.service';
import { DataService } from './data.service';
import { RegistrationForm, AccountResponse } from 'src/app/common/types/account';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private authService: AuthService, private mailService: MailService, private router: Router, private dataService: DataService, private formService: FormService, private formBuilder: FormBuilder) { }

  async sendAccountCreationEmail(registrationForm: RegistrationForm) {
    const emailHTML = this.mailService.generateAccountCreationEmail(registrationForm);
    const emailData = {
      action: 'mail',
      mail_type: 'account_creation',
      subject: 'Welcome to Hellenic Grocery',
      email_HTML: emailHTML,
      address: registrationForm.email,
      name: 'Customer',
    };

    let response = await this.mailService.sendEmail(emailData);
    if (!response.success) {
      this.formService.setPopupMessage('There was an issue sending you account creation confirmation email. Please contact support for help: support@hellenicgrocery.co.uk');
    }

    return response.success;
  }

  async createAccount(registrationForm: RegistrationForm, valid: boolean): Promise<AccountResponse> {
    if (!valid) {
      return { success: false, message: 'Please address the fields highlighted in red!' };
    }

    if (!registrationForm.termsAndConditions) {
      return { success: false, message: 'Please accept the terms and conditions!' };
    }

    if (registrationForm.password != registrationForm.passwordRepeat) {
      return { success: false, message: 'Your passwords do not match!' };
    }

    if (!(await this.preSubmissionChecks(registrationForm.email))) {
      return { success: false, message: 'This email address has already been registered!' };
    }

    delete registrationForm.passwordRepeat;
    let response = await lastValueFrom(this.dataService.submitFormData(registrationForm));

    if (!response.success) {
      return { success: false, message: 'There was an error creating your account! Please contact support: support@hellenicgrocery.co.uk' };
    }

    if (!registrationForm.promoConsent) {
      return { success: true, message: 'Account created successfully!' };
    }

    const newsletterForm = {
      email: registrationForm.email,
      action: 'add',
      table_name: 'mailing_list'
    };

    await lastValueFrom(this.dataService.submitFormData(newsletterForm));

    return { success: true, message: 'Account created successfully!' };
  }

  async preSubmissionChecks(email: string) {
    let userIDs = await this.dataService.processGet("user-id-from-email", { filter: email });

    return userIDs.length === 0;
  }
}