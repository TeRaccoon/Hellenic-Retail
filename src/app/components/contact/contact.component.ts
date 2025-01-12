import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstManager, settingKeys } from 'src/app/common/const/const-manager';
import { Response } from 'src/app/common/types/data-response';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { MailService } from 'src/app/services/mail.service';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactForm: FormGroup;

  supportEmail;
  supportPhone;
  address;

  isLoading = false;
  loading = faCircleNotch;

  submitted = false;

  constructor(
    private formService: FormService,
    private formBuilder: FormBuilder,
    private mailService: MailService,
    private consts: ConstManager
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      action: ['email'],
    });
    this.supportEmail = this.consts.getConstant(settingKeys.support_email);
    this.supportPhone = this.consts.getConstant(settingKeys.support_phone);
    this.address = this.consts.getConstant(settingKeys.address);
  }

  async onSubmit() {
    this.submitted = true;
    this.isLoading = true;

    if (this.contactForm.valid) {
      const emailInformation = {
        name: this.contactForm.get('name')?.value,
        email: this.contactForm.get('email')?.value,
        message: this.contactForm.get('message')?.value,
      };

      const emailHTML =
        this.mailService.generateCustomerMessageEmail(emailInformation);

      const emailData = {
        action: 'mail',
        mail_type: 'message',
        subject: 'New Customer Message',
        email_HTML: emailHTML,
        address: this.supportEmail,
        name: 'Auto Generated',
      };

      let response: Response = await this.mailService.sendEmail(emailData);

      if (response.success) {
        this.formService.setPopupMessage('Message submitted successfully!');
        this.contactForm.reset();
        this.submitted = false;
      } else {
        this.formService.setPopupMessage(
          'There was an issue submitting your message!'
        );
      }
      this.formService.showPopup();
    } else {
      this.contactForm.markAllAsTouched();
    }
    this.isLoading = false;
  }
}
