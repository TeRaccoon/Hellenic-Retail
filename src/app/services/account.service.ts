import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormService } from './form.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MailService } from './mail.service';
import { DataService } from './data.service';
import {
  RegistrationForm,
  AccountResponse,
} from 'src/app/common/types/account';
import { lastValueFrom } from 'rxjs';
import { ConstManager, settingKeys } from '../common/const/const-manager';
import { YesNo } from '../common/types/checkout';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  supportEmail = '';

  constructor(
    private mailService: MailService,
    private dataService: DataService,
    private formService: FormService,
    private consts: ConstManager
  ) {
    this.supportEmail = this.consts.getConstant(settingKeys.support_email);
  }

  async createAccount(
    registrationForm: RegistrationForm,
    valid: boolean = true,
    passwordless = false
  ): Promise<AccountResponse> {
    if (passwordless) {
      registrationForm.password = this.generatePassword();
      registrationForm.passwordRepeat = registrationForm.password;
    }

    if (!valid) {
      return {
        success: false,
        message: 'Please address the fields highlighted in red!',
      };
    }

    if (!registrationForm.termsAndConditions) {
      return {
        success: false,
        message: 'Please accept the terms and conditions!',
      };
    }

    if (registrationForm.password != registrationForm.passwordRepeat) {
      return { success: false, message: 'Your passwords do not match!' };
    }

    if (!(await this.preSubmissionChecks(registrationForm.email))) {
      return {
        success: false,
        message: 'This email address has already been registered!',
      };
    }

    if (registrationForm.businessRequest) {
      registrationForm.pending_approval = YesNo.Yes;
    }

    delete registrationForm.passwordRepeat;
    let response = await lastValueFrom(
      this.dataService.submitFormData(registrationForm)
    );

    if (!response.success) {
      return {
        success: false,
        message: `There was an error creating your account! Please contact support: ${this.supportEmail}`,
      };
    }

    await this.sendAccountCreationEmail(registrationForm, passwordless);

    if (registrationForm.promoConsent) {
      this.registerForNewsletters(registrationForm.email);
    }
    if (registrationForm.businessRequest) {
      this.requestBusinessAccount(registrationForm);
    }

    return {
      success: true,
      message: 'Account created successfully!',
      data: response.data.id,
    };
  }

  async sendAccountCreationEmail(
    registrationForm: RegistrationForm,
    passwordless = false
  ) {
    const emailHTML = this.mailService.generateAccountCreationEmail(
      registrationForm,
      passwordless
    );
    const emailData = {
      action: 'mail',
      mail_type: 'account_creation',
      subject: 'New Business Account Request',
      email_HTML: emailHTML,
      address: registrationForm.email,
      name: 'Customer',
    };

    let response = await this.mailService.sendEmail(emailData);
    if (!response.success) {
      this.formService.setPopupMessage(
        `There was an issue sending you account creation confirmation email. Please contact support for help: ${this.supportEmail}`
      );
    }

    return response.success;
  }

  async requestBusinessAccount(registrationForm: RegistrationForm) {
    const emailHTML =
      this.mailService.generateBusinessRequestEmail(registrationForm);

    const emailData = {
      action: 'mail',
      mail_type: 'business_account_request',
      subject: 'Welcome to Hellenic Grocery',
      email_HTML: emailHTML,
      address: this.supportEmail,
      name: 'Customer',
    };

    let response = await this.mailService.sendEmail(emailData);

    return response.success;
  }

  async registerForNewsletters(email: string) {
    const newsletterForm = {
      email: email,
      action: 'add',
      table_name: 'mailing_list',
    };

    await lastValueFrom(this.dataService.submitFormData(newsletterForm));
  }

  async preSubmissionChecks(email: string) {
    let userIDs = await this.dataService.processGet('user-id-from-email', {
      filter: email,
    });

    return userIDs.length === 0;
  }

  generatePassword() {
    let length = 12;
    let charset = 'abcdefghijklmnopqrstuvwxyz1234567890!,.#';
    let password = '';
    for (let i = 0, n = charset.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
}
